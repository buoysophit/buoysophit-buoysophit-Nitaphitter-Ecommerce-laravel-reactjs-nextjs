<?php


namespace Marvel\Otp\Gateways;

use Marvel\Otp\OtpInterface;
use Marvel\Otp\Result;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;


class TwilioGateway implements OtpInterface
{

	/**
	 * @var Client
	 */
	private $client;


	/**
	 * @var string
	 */
	private $verification_sid;


	/**
	 * Verification constructor.
	 * @param $client
	 * @param string|null $verification_sid
	 * @throws \Twilio\Exceptions\ConfigurationException
	 */
	public function __construct($client = null, string $verification_sid = null)
	{
		if ($client === null) {
			$sid = config('services.twilio.account_sid');
			$token = config('services.twilio.auth_token');
			$client = new Client($sid, $token);
		}
		$this->client = $client;
		$this->verification_sid = $verification_sid ?: config('services.twilio.verification_sid');
	}


	/**
	 * Start a phone verification process using Twilio Verify V2 API
	 *
	 * @param $phone_number
	 * @return Result
	 */
	public function startVerification($phone_number)
	{
		try {
			$verification = $this->client->verify->v2->services($this->verification_sid)
				->verifications
				->create($phone_number, 'sms');
			return new Result($verification->sid);
		} catch (TwilioException $exception) {
			return new Result(["Verification failed to start: {$exception->getMessage()}"]);
		}
	}

	/**
	 * Check verification code using Twilio Verify V2 API
	 *
	 * @param $phone_number
	 * @param $code
	 * @return Result
	 */
	public function checkVerification($id, $code, $phone_number)
	{
		try {
			$verification_check = $this->client->verify->v2->services($this->verification_sid)
				->verificationChecks
				->create(['to' => $phone_number, 'code' => $code]);
			if ($verification_check->status === 'approved') {
				return new Result($verification_check->sid);
			}
			return new Result(['Verification check failed: Invalid code.']);
		} catch (TwilioException $exception) {
			return new Result(["Verification check failed: {$exception->getMessage()}"]);
		}
	}

	/**
	 * The function sends an SMS message using Twilio API and returns a result object.
	 * 
	 * @param phone_number The phone number to which the SMS message will be sent.
	 * @param message The message to be sent via SMS.
	 * 
	 * @return Result an instance of the `Result` class. If the message is successfully sent, it returns a
	 * `Result` object with the `sid` property set to the message ID. If there is an error, it returns a
	 * `Result` object with an array containing an error message.
	 */
	public function sendSms($phone_number, $messageBody): Result
	{

		try {
			$message = $this->client->messages->create(
				"+$phone_number",
				[
					'from' => config('services.twilio.from'),
					'body' => $messageBody
				]
			);
			return new Result($message->sid);
		} catch (TwilioException $exception) {
			return new Result(["Message failed to send: {$exception->getMessage()}"]);
		}
	}
}
