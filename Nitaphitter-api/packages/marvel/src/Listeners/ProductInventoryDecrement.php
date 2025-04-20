<?php

namespace Marvel\Listeners;

use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Variation;

class ProductInventoryDecrement implements ShouldQueue
{
    protected function updateProductInventory($eventData)
    {
        try {
            $fetchedProduct = Product::findOrFail($eventData->id);
            $currentQuantity = $fetchedProduct->quantity - (int) $eventData->pivot->order_quantity;
            $sold_quantity = $fetchedProduct->sold_quantity + (int) $eventData->pivot->order_quantity;

            if ($currentQuantity > -1) {

                $fetchedProduct->update(
                    [
                        'quantity' => $currentQuantity,
                        'sold_quantity' => $sold_quantity
                    ]
                );

                // ****** there was a cause for this condition

                // if (TRANSLATION_ENABLED) {
                //     $this->updateTranslationsInventory($eventData, $currentQuantity, $eventData->sold_quantity);
                // } else {
                //     $fetchedProduct->update(
                //         [
                //             'quantity' => $currentQuantity,
                //             'sold_quantity' => $sold_quantity
                //         ]
                //     );
                // }

                if (!empty($eventData->pivot->variation_option_id)) {
                    $variationOption = Variation::findOrFail($eventData->pivot->variation_option_id);
                    $currentVariationOptionQuantity = $variationOption->quantity - (int) $eventData->pivot->order_quantity;
                    $variationOptionSoldQuantity = $variationOption->sold_quantity + (int) $eventData->pivot->order_quantity;

                    $variationOption->update([
                        'quantity' => $currentVariationOptionQuantity,
                        'sold_quantity' => $variationOptionSoldQuantity
                    ]);

                    // ****** there was a cause for this condition
                    // if (TRANSLATION_ENABLED) {
                    //     $this->updateVariationTranslationsInventory($variationOption, $variationOption->quantity);
                    // } else {
                    //     $variationOption->update([
                    //         'quantity' => $currentVariationOptionQuantity,
                    //         'sold_quantity' => $variationOptionSoldQuantity
                    //     ]);
                    // }
                }
            }
        } catch (Exception $th) {
            //
        }
    }

    // public function updateTranslationsInventory($product, $updatedQuantity, $sold_quantity)
    // {
    //     Product::where('id', $product->id)->update([
    //         'quantity' => $updatedQuantity,
    //         'sold_quantity' => $sold_quantity
    //     ]);
    // }

    // public function updateVariationTranslationsInventory($variationOption, $updatedQuantity)
    // {
    //     Variation::where('id', $variationOption->id)->update([
    //         'quantity' => $updatedQuantity,
    //         'sold_quantity' => $variationOption->sold_quantity
    //     ]);
    // }


    public function handle($event)
    {
        $products = $event->order->products;
        foreach ($products as $product) {
            $this->updateProductInventory($product);
        }
    }
}