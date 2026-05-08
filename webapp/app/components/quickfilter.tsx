import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useApplyChangedSearch } from "~/hooks/use_changed_search";
import { SearchParamKey } from "~/config/search_param";
import type { Board } from "~/types/hotel";

const BOARD_OPTIONS: Board[] = ["ro", "bb", "hb", "fb", "ai"];

export function Quickfilter() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const applySearch = useApplyChangedSearch();

  const currentStars = searchParams.get(SearchParamKey.Stars) ?? "";
  const currentMaxPrice = searchParams.get(SearchParamKey.MaxPrice) ?? "";
  const currentBoard = searchParams.get(SearchParamKey.Board) ?? "";

  const handleStars = (value: string) => {
    applySearch({ [SearchParamKey.Stars]: value || undefined });
  };

  const handleMaxPrice = (value: string) => {
    applySearch({ [SearchParamKey.MaxPrice]: value || undefined });
  };

  const handleBoard = (value: string) => {
    applySearch({ [SearchParamKey.Board]: value || undefined });
  };

  const handleReset = () => {
    applySearch({
      [SearchParamKey.Stars]: undefined,
      [SearchParamKey.MaxPrice]: undefined,
      [SearchParamKey.Board]: undefined,
    });
  };

  return (
    <div       className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <select
        value={currentStars}
        onChange={(e) => handleStars(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
      >
        <option value="">{t("filter.stars")}</option>
        {[3, 4, 5].map((s) => (
          <option key={s} value={s}>
            {s}+ {t("filter.stars")}
          </option>
        ))}
      </select>

      <select
        value={currentMaxPrice}
        onChange={(e) => handleMaxPrice(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
      >
        <option value="">{t("filter.maxPrice")}</option>
        {[500, 1000, 1500, 2000].map((p) => (
          <option key={p} value={p}>
            ≤ {p} €
          </option>
        ))}
      </select>

      <select
        value={currentBoard}
        onChange={(e) => handleBoard(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
      >
        <option value="">{t("filter.board")}</option>
        {BOARD_OPTIONS.map((b) => (
          <option key={b} value={b}>
            {t(`filter.boardOptions.${b}`)}
          </option>
        ))}
      </select>

      {(currentStars || currentMaxPrice || currentBoard) && (
        <button
          onClick={handleReset}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
        >
          {t("filter.reset")}
        </button>
      )}
    </div>
  );
}
