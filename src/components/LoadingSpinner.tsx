import { useLocale } from "@/context/LocaleContext";
import React from "react";

const LoadingSpinner: React.FC = () => {
  const { t } = useLocale();

  return (
    <div className="flex justify-center items-center space-x-2 my-8 text-sm ">
      <div
        className="w-4 h-4 border-2 border-solid rounded-full animate-spin"
        style={{ borderColor: "#C5705D", borderTopColor: "transparent" }}
      ></div>
      <span className="text-gray-600 italic">{t("app.loading")}</span>
    </div>
  );
};

export default LoadingSpinner;
