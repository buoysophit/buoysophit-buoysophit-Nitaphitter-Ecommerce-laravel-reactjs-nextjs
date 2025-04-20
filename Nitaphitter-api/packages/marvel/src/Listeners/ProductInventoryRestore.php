<?php

namespace Marvel\Listeners;

use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Variation;

class ProductInventoryRestore implements ShouldQueue
{
    protected function updateProductInventory($eventData)
    {
        try {
            $fetchedProduct = Product::findOrFail($eventData->id);
            $current_quantity = $fetchedProduct->quantity + (int) $eventData->pivot->order_quantity;
            $sold_quantity = $fetchedProduct->sold_quantity - (int) $eventData->pivot->order_quantity;

            if ($current_quantity > -1) {

                $fetchedProduct->update(
                    [
                        'quantity' => $current_quantity,
                        'sold_quantity' => $sold_quantity
                    ]
                );


                // ****** there was a cause for this condition

                // if (TRANSLATION_ENABLED) {
                //     $this->updateTranslationsInventory($eventData, $current_quantity);
                // } else {
                //     Product::find($eventData->id)->update(['quantity' => $current_quantity]);
                // }

                if (!empty($eventData->pivot->variation_option_id)) {
                    $variationOption = Variation::findOrFail($eventData->pivot->variation_option_id);
                    $currentVariationOptionQuantity = $variationOption->quantity + (int) $eventData->pivot->order_quantity;
                    $variationOptionSoldQuantity = $variationOption->sold_quantity - (int) $eventData->pivot->order_quantity;

                    $variationOption->update([
                        'quantity' => $currentVariationOptionQuantity,
                        'sold_quantity' => $variationOptionSoldQuantity
                    ]);

                    // ****** there was a cause for this condition

                    // if (TRANSLATION_ENABLED) {
                    //     $this->updateVariationTranslationsInventory($variationOption, $variationOption->quantity);
                    // } else {
                    //     $variationOption->update([['quantity' => $variationOption->quantity]]);
                    // }
                }
            }
        } catch (Exception $th) {
            //
        }
    }

    // public function updateTranslationsInventory($product, $updatedQuantity)
    // {
    //     Product::where('sku', $product->sku)->update(['quantity' => $updatedQuantity]);
    // }

    // public function updateVariationTranslationsInventory($variationOption, $updatedQuantity)
    // {
    //     Variation::where('sku', $variationOption->sku)->update(['quantity' => $updatedQuantity]);
    // }

    public function handle($event)
    {
        $products = $event->order->products;
        foreach ($products as $product) {
            $this->updateProductInventory($product);
        }
    }
}
