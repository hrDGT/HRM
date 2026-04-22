"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { setLocaleAction } from "../actions/set-locale-action";

export default function SettingPageContent() {
  const t = useTranslations("Settings");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const currentLocale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [resumeLang, setResumeLang] = useState(currentLocale);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = async (newLocale: string) => {
    await setLocaleAction(newLocale);
    router.refresh();
  };

  if (!mounted) return null;

  const fieldsetClasses =
    "border border-main-border hover:border-main-text rounded-md px-3 pt-0 pb-1.5 transition-all";
  const legendClasses =
    "text-[11px] text-secondary-text px-1 uppercase tracking-wider";

  const triggerClasses =
    "w-full border-0 p-0 h-7 text-base shadow-none text-main-text bg-transparent outline-none cursor-pointer";

  const contentClasses = "shadow-action-menu bg-action-menu-bg py-2";
  const itemClasses =
    "p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked";

  return (
    <div className="flex-1 flex flex-col p-8 bg-main-bg text-main-text h-full">
      <h1 className="text-secondary-text text-base mb-10">{t("title")}</h1>

      <div className="w-full max-w-150 flex flex-col gap-8 self-center">
        <fieldset className={fieldsetClasses}>
          <legend className={legendClasses}>{t("appearance")}</legend>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className={triggerClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={5} className={contentClasses}>
              <SelectItem value="light" className={itemClasses}>
                {t("light")}
              </SelectItem>
              <SelectItem value="dark" className={itemClasses}>
                {t("dark")}
              </SelectItem>
              <SelectItem value="system" className={itemClasses}>
                {t("deviceSettings")}
              </SelectItem>
            </SelectContent>
          </Select>
        </fieldset>

        <fieldset className={fieldsetClasses}>
          <legend className={legendClasses}>{t("language")}</legend>
          <Select value={currentLocale} onValueChange={handleLanguageChange}>
            <SelectTrigger className={triggerClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={5} className={contentClasses}>
              <SelectItem value="en" className={itemClasses}>
                English
              </SelectItem>
              <SelectItem value="de" className={itemClasses}>
                Deutsch
              </SelectItem>
              <SelectItem value="ru" className={itemClasses}>
                Русский
              </SelectItem>
            </SelectContent>
          </Select>
        </fieldset>

        <fieldset className={fieldsetClasses}>
          <legend className={legendClasses}>{t("resumeLanguage")}</legend>
          <Select value={resumeLang} onValueChange={setResumeLang}>
            <SelectTrigger className={triggerClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={5} className={contentClasses}>
              <SelectItem value="en" className={itemClasses}>
                English
              </SelectItem>
              <SelectItem value="de" className={itemClasses}>
                Deutsch
              </SelectItem>
              <SelectItem value="ru" className={itemClasses}>
                Русский
              </SelectItem>
            </SelectContent>
          </Select>
        </fieldset>
      </div>
    </div>
  );
}
