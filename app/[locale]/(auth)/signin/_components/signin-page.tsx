"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";

type FormState = {
  errors: {
    email?: string;
    password?: string;
  };
};

const initialState: FormState = {
  errors: {},
};

export const SigninPage = () => {
  const t = useTranslations("auth.signin");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (
      _previousState: FormState,
      formData: FormData,
    ): Promise<FormState> => {
      const data = Object.fromEntries(formData.entries());
      const errors: FormState["errors"] = {};

      if (!data.email || !data.email.toString().trim()) {
        errors.email = t("emailRequired");
      }

      if (!data.password || data.password.toString().length < 8) {
        errors.password = t("passwordRequired");
      }

      if (Object.keys(errors).length > 0) {
        return {
          errors,
        };
      }

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          errors: {
            email: result.message,
          },
        };
      }
      router.push("/");
      return {
        errors: {},
      };
    },
    initialState,
  );

  return (
    <div className="flex h-svh w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>

          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form id="signin" action={formAction}>
            <FieldGroup>
              <Field data-invalid={!!state.errors.email}>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                />
                {state.errors.email && (
                  <FieldError>{state.errors.email}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!state.errors.password}>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>

                <div className="relative">
                  <Input
                    className="bg-background pe-9"
                    id="password"
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />

                  <Button
                    className="absolute end-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {state.errors.password && (
                  <FieldError>{state.errors.password}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" form="signin">
            {isPending ? t("loading") : t("submit")}
          </Button>

          <Button
            variant="link"
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            {t("noAccount")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
