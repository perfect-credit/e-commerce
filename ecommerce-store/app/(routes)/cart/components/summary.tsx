"use client";

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Order placed successfully.");
            removeAll();
        }

        if (searchParams.get("canceled")) {
            toast.error("Order canceled.");
        }
    }, [searchParams, removeAll]);

    const onCheckout = async () => {
        if (items?.length === 0) return;
        const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
             // @ts-ignore
            productIds: items?.map(item => item.id),
        });

        window.location = response.data.uri;
    };

    const totalPrice = items?.reduce((total, item) => {
        return total + Number(item.price);
    }, 0);

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
                Order Summary
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                        Order Total
                    </div>
                    <Currency value={totalPrice}/>
                </div>
            </div>
            <Button onClick={onCheckout} className="w-full mt-6">
                Proceed to Checkout
            </Button>
        </div>
    );
};

export default Summary;
