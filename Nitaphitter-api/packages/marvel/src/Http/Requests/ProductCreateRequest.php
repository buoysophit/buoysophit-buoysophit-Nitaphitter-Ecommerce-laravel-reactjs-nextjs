<?php

namespace Marvel\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Marvel\Enums\ProductStatus;
use Marvel\Enums\ProductType;

class ProductCreateRequest extends FormRequest
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
        $productStatus = [
            ProductStatus::UNDER_REVIEW,
            ProductStatus::APPROVED,
            ProductStatus::REJECTED,
            ProductStatus::PUBLISH,
            ProductStatus::UNPUBLISH,
            ProductStatus::DRAFT,
        ];

        $productType = [
            ProductType::SIMPLE,
            ProductType::VARIABLE
        ];

        return [
            'name'                         => ['required', 'string', 'max:255'],
            'slug'                         => ['nullable', 'string'],
            'price'                        => ['nullable', 'numeric'],
            'sale_price'                   => ['nullable', 'lte:price'],
            'type_id'                      => ['required', 'exists:Marvel\Database\Models\Type,id'],
            'shop_id'                      => ['required', 'exists:Marvel\Database\Models\Shop,id'],
            'manufacturer_id'              => ['nullable', 'exists:Marvel\Database\Models\Manufacturer,id'],
            'author_id'                    => ['nullable', 'exists:Marvel\Database\Models\Author,id'],
            'product_type'                 => ['required', Rule::in($productType)],
            'categories'                   => ['array'],
            'tags'                         => ['array'],
            'language'                     => ['nullable', 'string'],
            'dropoff_locations'            => ['array'],
            'pickup_locations'             => ['array'],
            'digital_file'                 => ['array'],
            'variations'                   => ['array'],
            'variation_options'            => ['array'],
            'quantity'                     => ['nullable', 'integer'],
            'unit'                         => ['required', 'string'],
            'description'                  => ['nullable', 'string', 'max:10000'],
            'sku'                          => ['string', 'unique:variation_options,sku'],
            'image'                        => ['array'],
            'gallery'                      => ['array'],
            'video'                        => ['array'],
            'status'                       => ['string', Rule::in($productStatus)],
            'height'                       => ['nullable', 'string'],
            'length'                       => ['nullable', 'string'],
            'width'                        => ['nullable', 'string'],
            'external_product_url'         => ['nullable', 'string'],
            'external_product_button_text' => ['nullable', 'string'],
            'in_stock'                     => ['boolean'],
            'is_taxable'                   => ['boolean'],
            'is_digital'                   => ['boolean'],
            'is_external'                  => ['boolean'],
            'is_rental'                    => ['boolean'],
            "variation_options.upsert.*.sku" => ['string', 'unique:variation_options,sku'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
