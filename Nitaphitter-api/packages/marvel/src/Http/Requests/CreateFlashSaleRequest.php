<?php

namespace Marvel\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Marvel\Database\Models\FlashSale;

class CreateFlashSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title'        => ['required', 'string'],
            'description'  => ['required', 'string', 'max:10000'],
            'start_date'   => ['required', 'date'],
            'end_date'     => ['required', 'date'],
            'slug'         => ['nullable', 'string'],
            'language'     => ['nullable', 'string'],
            'image'        => ['nullable', 'array'],
            'cover_image'  => ['nullable', 'array'],
            'sale_builder' => ['required', 'array']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
