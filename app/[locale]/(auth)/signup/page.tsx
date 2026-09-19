"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";


export default function Signup() {
  const t = useTranslations("auth.signup");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-svh w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>

          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>

          <form id="signup">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>

                <div className="relative">
                  <Input
                    className="bg-background pe-9"
                    id="password"
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
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
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" form="signup">
            {t("submit")}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t("haveAccount")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
