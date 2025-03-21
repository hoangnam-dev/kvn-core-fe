"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import login from "../../actions/Auth/login";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {LoginRequest} from "@/model/request/form.login";
import Loader from "@/components/single/loader";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({password: "", username: ""})
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const setFormField = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData)

      if(typeof response === 'string'){
        setError(response);
        return;
      } else {
        document.cookie = `auth-token=${response.accessToken}`;

        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
      )}

      {loading && (
          <Loader />
      )}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="48" height="48">
                  <path
                      d="M0 0 C0.75410156 0.09990234 1.50820313 0.19980469 2.28515625 0.30273438 C4.14917753 0.55048404 6.01219288 0.80578057 7.875 1.0625 C9.41853085 4.98287897 8.26857453 7.41332209 6.6875 11.1875 C6.26082031 12.24195313 5.83414063 13.29640625 5.39453125 14.3828125 C3.78819573 17.21557899 2.89640374 18.01438992 -0.125 19.0625 C-1.115 18.4025 -2.105 17.7425 -3.125 17.0625 C-5.105 18.0525 -5.105 18.0525 -7.125 19.0625 C-7.125 19.7225 -7.125 20.3825 -7.125 21.0625 C-6.361875 21.330625 -5.59875 21.59875 -4.8125 21.875 C-0.70741758 23.68887363 -0.70741758 23.68887363 0.875 26.0625 C2.41407354 32.87839709 2.41407354 32.87839709 0.7421875 36.55078125 C-1.48331635 39.54450295 -3.78401591 41.29211605 -6.875 43.375 C-7.88046875 44.07238281 -8.8859375 44.76976562 -9.921875 45.48828125 C-13.65563655 47.32328845 -16.01356921 47.50579408 -20.125 47.0625 C-23.125 45.0625 -23.125 45.0625 -24.125 42.3125 C-24.125 37.76671048 -22.23503066 36.24321318 -19.125 33.0625 C-18.2278125 32.134375 -18.2278125 32.134375 -17.3125 31.1875 C-16.920625 30.81625 -16.52875 30.445 -16.125 30.0625 C-16.99125 29.93875 -16.99125 29.93875 -17.875 29.8125 C-21.0114184 28.7670272 -22.21456046 27.79169934 -24.125 25.0625 C-24.92191905 20.79898311 -24.77186338 17.29742101 -22.75 13.4375 C-19.47452506 10.47397506 -15.91276406 8.14935237 -12.171875 5.80859375 C-11.15867187 4.94427734 -11.15867187 4.94427734 -10.125 4.0625 C-10.125 2.7425 -10.125 1.4225 -10.125 0.0625 C-6.87932383 -1.56033808 -3.48660376 -0.48475234 0 0 Z "
                      fill="#696CFF" transform="translate(32.125,0.9375)"/>
                  <path
                      d="M0 0 C0.75410156 0.09990234 1.50820313 0.19980469 2.28515625 0.30273438 C4.14917753 0.55048404 6.01219288 0.80578057 7.875 1.0625 C9.41853085 4.98287897 8.26857453 7.41332209 6.6875 11.1875 C6.26082031 12.24195313 5.83414063 13.29640625 5.39453125 14.3828125 C3.78819573 17.21557899 2.89640374 18.01438992 -0.125 19.0625 C-1.115 18.4025 -2.105 17.7425 -3.125 17.0625 C-3.640625 17.578125 -4.15625 18.09375 -4.6875 18.625 C-7.125 20.0625 -7.125 20.0625 -10.625 20 C-14.42848432 18.98120956 -15.98536129 18.36110967 -18.125 15.0625 C-18.3125 12.125 -18.3125 12.125 -17.125 9.0625 C-15.36946204 7.61209126 -13.60106615 6.4593826 -11.62109375 5.3359375 C-11.12738281 4.91570313 -10.63367188 4.49546875 -10.125 4.0625 C-10.125 2.7425 -10.125 1.4225 -10.125 0.0625 C-6.87932383 -1.56033808 -3.48660376 -0.48475234 0 0 Z "
                      fill="#8688FF" transform="translate(32.125,0.9375)"/>
                  <path
                      d="M0 0 C5.14760638 1.2606383 5.14760638 1.2606383 7.0625 2.75 C8.125 5.5625 8.125 5.5625 8.0625 8.75 C5.63004989 11.72299458 3.25336664 13.62275557 0.0625 15.75 C-6.26008065 16.2016129 -6.26008065 16.2016129 -9.9375 13.75 C-10.9375 11 -10.9375 11 -10.9375 7.75 C-5.26207496 -0.44783617 -5.26207496 -0.44783617 0 0 Z "
                      fill="#8789FF" transform="translate(18.9375,32.25)"/>
                </svg>
                Sign in with KVN Task Management
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username<span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="kvn" type="text" onChange={(e) => setFormField("username", e.target.value)}/>
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setFormField("password", e.target.value)}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                      ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked}/>
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                      href="/"
                      // href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
