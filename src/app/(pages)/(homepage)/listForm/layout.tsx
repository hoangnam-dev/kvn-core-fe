"use client";

import React from "react";

export default function GridLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {

    return (
        <div className="max-h-[calc(100vh-100px)]">{children}</div>
    );
}
