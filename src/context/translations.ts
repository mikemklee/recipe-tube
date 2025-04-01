import { Translations } from "./LocaleContext";

export const translations: Translations = {
  en: {
    "app.title": "RecipeTube",
    "app.description.1":
      "Extract nicely formatted recipes from cooking videos with a single click!",
    "app.description.2":
      "Works best with videos that clearly demonstrate recipes step by step.",
    "app.madeBy": "Made by",
    "error.title": "Something went wrong!",
    "error.url": "URL:",
    "app.loading": "Extracting recipe... This may take a moment.",
    "recipe.ingredients": "Ingredients",
    "recipe.instructions": "Instructions",
    "recipe.extractedFrom": "Extracted from",
    "recipe.originalTitle": "Original Video",
    "recipe.prep": "Prep time",
    "recipe.cook": "Cooking time",
    "recipe.total": "Total",
    "recipe.servings": "Servings",
    // Include translations from UrlInputForm
    "urlInput.title": "Extract recipe",
    "urlInput.placeholder": "Paste a YouTube recipe video URL here",
    "urlInput.button": "Go!",
    "urlInput.processing": "Processing...",
    "apiKey.title": "Gemini API Key",
    "apiKey.description":
      "Enter your Gemini API key to use the recipe extraction service.",
    "apiKey.placeholder": "Enter your Gemini API key",
    "apiKey.save": "Save",
    "apiKey.saved": "Saved",
    "apiKey.clear": "Clear",
    "apiKey.securityNote":
      "Your API key is stored locally and never stored in our servers.",
  },
  ko: {
    "app.title": "RecipeTube",
    "app.description.1":
      "클릭 한번으로 유튜브 요리 영상에서 깔끔하게 정리된 레시피를 뽑아내세요!",
    "app.description.2":
      "레시피를 단계별로 명확하게 보여주는 영상에서 가장 잘 작동합니다.",
    "app.madeBy": "제작자",
    "error.title": "문제가 발생했습니다!",
    "error.url": "링크:",
    "app.loading": "레시피 추출 중... 잠시만 기다려주세요.",
    "recipe.ingredients": "재료",
    "recipe.instructions": "조리 방법",
    "recipe.extractedFrom": "출처",
    "recipe.originalTitle": "원본 비디오",
    "recipe.prep": "준비 시간",
    "recipe.cook": "조리 시간",
    "recipe.total": "총 소요 시간",
    "recipe.servings": "분량",
    // Include translations from UrlInputForm
    "urlInput.title": "레시피 추출",
    "urlInput.placeholder": "유튜브 영상 URL을 여기에 붙여넣으세요",
    "urlInput.button": "시작!",
    "urlInput.processing": "처리 중...",
    "apiKey.title": "Gemini API 키",
    "apiKey.description":
      "레시피 추출 서비스를 사용하려면 Gemini API 키를 입력하세요.",
    "apiKey.placeholder": "Gemini API 키 입력",
    "apiKey.save": "저장",
    "apiKey.saved": "저장됨",
    "apiKey.clear": "삭제",
    "apiKey.securityNote":
      "API 키는 브라우저에만 저장되며 서버에 기록이 남지 않습니다.",
  },
};
