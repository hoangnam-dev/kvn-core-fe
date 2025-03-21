import GenGrid from "@/components/gen-data/gen-data";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title:
        "KVN Core",
    description: "KVN Core",
};

export default async function GenDataPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string, sub_slug: number }>
}) {
    const { slug, sub_slug } = await params

    return (
        <div>
            <GenGrid id={sub_slug} name={slug} haveChildren={false} />
        </div>
    );
}