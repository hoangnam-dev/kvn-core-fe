import Image from "next/image";
import React from "react";

export default function GridShape() {
    return (
        <div className="absolute bottom-0 right-0 md:right-0 md:left-auto inset-x-0 flex justify-center md:justify-end -z-1 w-full max-w-[450px] xl:max-w-[555px]">
            <Image
                width={540}
                height={254}
                src="/images/error/backdrop.png"
                alt="grid"
                className="filter blur-md"
            />
        </div>
    );
}
