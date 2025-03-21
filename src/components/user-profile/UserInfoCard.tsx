"use client";
import React from "react";
import {UserMetaCardProps} from "@/components/user-profile/UserMetaCard";
import ProfilePlaceholder from "@/common/messages/profile.json";
import {useTranslate} from "@/hooks/useTranslate";

export default function UserInfoCard({ acc }: UserMetaCardProps) {

  function extractViJp(input: string | undefined): { vi: string | null, jp: string | null } {
    if (!input) return { vi: null, jp: null }; // Nếu input là undefined, trả về null cho cả vi và jp

    const parts = input.split('_');

    if (parts.length === 2) {
      const [vi, jp] = parts;
      return { vi: vi.trim() || null, jp: jp.trim() || null };
    }

    if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(input)) {
      return { vi: null, jp: input.trim() || null };
    }

    return { vi: input.trim() || null, jp: null };
  }

  const translate = useTranslate();
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {translate(ProfilePlaceholder.personal_information)}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {translate(ProfilePlaceholder.name)}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {extractViJp(acc?.fullName).vi || "Unknown Name"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {translate(ProfilePlaceholder.nickname)}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {extractViJp(acc?.fullName).jp || "Unknown Name"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {translate(ProfilePlaceholder.email_address)}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {acc?.email || "Unkown Name"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {translate(ProfilePlaceholder.phone)}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {acc?.phone || "Unkown Phone"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
