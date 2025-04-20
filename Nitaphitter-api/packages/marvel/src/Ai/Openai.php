<?php

namespace Marvel\Ai;

use Exception;
use Marvel\Ai\AiInterface;
use Marvel\Ai\Base;
use OpenAI as OpenAIClient;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Openai extends Base implements AiInterface
{
    private $openAiClient;

    public function __construct()
    {
        $this->openAiClient = OpenAIClient::client(config('shop.openai.secret_Key'));
        parent::__construct();
    }
    /**
     * createCustomer
     *
     * @param  mixed  $request
     * @return array
     */
    public function generateDescription($request): mixed
    {
        try {
            $response = $this->openAiClient->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'user', 'content' => $request->prompt
                    ],
                ],
            ]);

            foreach ($response->choices as $result) {
                $result->index; // 0
                $result->message->role; // 'assistant'
                $result->message->content; // '\n\nHello there! How can I assist you today?'
                $result->finishReason; // 'stop'
            }

            return ['status' => 'success', 'result' => $result->message->content];
        } catch (Exception $e) {
            throw new HttpException(400, SOMETHING_WENT_WRONG);
        }
    }
}
