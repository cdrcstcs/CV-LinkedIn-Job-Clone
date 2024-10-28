<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log; // Ensure you include this at the top of your file
use App\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreApplicationAnswerRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\ApplicationAnswer;
use App\Models\ApplicationQuestion;
use App\Models\ApplicationQuestionAnswer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Symfony\Component\HttpFoundation\Request;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return ApplicationResource::collection(
            Application::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(6)
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreApplicationRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreApplicationRequest $request)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $application = Application::create($data);

        // Create new questions
        foreach ($data['questions'] as $question) {
            $question['application_id'] = $application->id;
            $this->createQuestion($question);
        }

        return new ApplicationResource($application);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function show(Application $application, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $application->user_id) {
            return abort(403, 'Unauthorized action');
        }
        return new ApplicationResource($application);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateApplicationRequest  $request
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateApplicationRequest $request, Application $application)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($application->image) {
                $absolutePath = public_path($application->image);
                File::delete($absolutePath);
            }
        }

        // Update application in the database
        $application->update($data);

        // Get ids as plain array of existing questions
        $existingIds = $application->questions()->pluck('id')->toArray();
        // Get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'], 'id');
        // Find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        //Find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // Delete questions by $toDelete array
        ApplicationQuestion::destroy($toDelete);

        // Create new questions
        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['application_id'] = $application->id;
                $this->createQuestion($question);
            }
        }

        // Update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($application->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }

        return new ApplicationResource($application);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function destroy(Application $application, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $application->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $application->delete();

        // If there is an old image, delete it
        if ($application->image) {
            $absolutePath = public_path($application->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }


    /**
     * Save image in local file system and return saved image path
     *
     * @param $image
     * @throws \Exception
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    /**
     * Create a question and return
     *
     * @param $data
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function createQuestion($data)
    {
        Log::info('Creating question with data:', $data);

        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        Log::info('Creating question with data:', $data);


        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => 'required|in:' . implode(',', QuestionTypeEnum::getValues()),
            'description' => 'nullable|string',
            'data' => 'present',
            'application_id' => 'exists:App\Models\Application,id'
        ]);

        return ApplicationQuestion::create($validator->validated());
    }

    /**
     * Update a question and return true or false
     *
     * @param \App\Models\ApplicationQuestion $question
     * @param                            $data
     * @return bool
     * @throws \Illuminate\Validation\ValidationException
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function updateQuestion(ApplicationQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\ApplicationQuestion,id',
            'question' => 'required|string',
            'type' => 'required|in:' . implode(',', QuestionTypeEnum::getValues()),
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }

    public function getBySlug(Application $application)
    {
        if (!$application->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($application->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }

        return new ApplicationResource($application);
    }

    public function storeAnswer(StoreApplicationAnswerRequest $request, Application $application)
    {
        $validated = $request->validated();

        $applicationAnswer = ApplicationAnswer::create([
            'application_id' => $application->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = ApplicationQuestion::where(['id' => $questionId, 'application_id' => $application->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }

            $data = [
                'application_question_id' => $questionId,
                'application_answer_id' => $applicationAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = ApplicationQuestionAnswer::create($data);
        }

        return response("", 201);
    }
}
