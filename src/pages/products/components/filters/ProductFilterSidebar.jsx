import { SearchFilterBox } from "./SearchFilterBox";
import { QuickFiltersBox } from "./QuickFiltersBox";
import { CategoryFilterBox } from "./CategoryFilterBox";
import { ActiveFilterTags } from "./ActiveFilterTags";
import { BrandFilterBox } from "./BrandFilterBox";
import { PriceRangeFilterBox } from "./PriceRangeFilterBox";
import { RatingFilterBox } from "./RatingFilterBox";
import { PromoBanner } from "./PromoBanner";

export function ProductFilterSidebar({
  searchInput,
  onSearchChange,
  quickFilters,
  quickFilterState,
  onToggleQuickFilter,
  categories,
  selectedCategory,
  onSelectCategory,
  activeFilterTags,
  onRemoveTag,
  onClearAll,
  brands,
  selectedBrands,
  onToggleBrand,
  priceInputs,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyPrice,
  ratingOptions,
  selectedRating,
  onSelectRating,
  onClearRating,
  onPromoClick,
}) {
  return (
    <>
      <SearchFilterBox value={searchInput} onChange={onSearchChange} />
      <QuickFiltersBox
        filters={quickFilters}
        state={quickFilterState}
        onToggle={onToggleQuickFilter}
      />
      <CategoryFilterBox
        categories={categories}
        selected={selectedCategory}
        onSelect={onSelectCategory}
      />
      <ActiveFilterTags
        tags={activeFilterTags}
        onRemove={onRemoveTag}
        onClearAll={onClearAll}
      />
      <BrandFilterBox
        brands={brands}
        selected={selectedBrands}
        onToggle={onToggleBrand}
      />
      <PriceRangeFilterBox
        min={priceInputs.min}
        max={priceInputs.max}
        onMinChange={onPriceMinChange}
        onMaxChange={onPriceMaxChange}
        onApply={onApplyPrice}
      />
      <RatingFilterBox
        options={ratingOptions}
        selected={selectedRating}
        onSelect={onSelectRating}
        onClear={onClearRating}
      />
      <PromoBanner onClick={onPromoClick} />
    </>
  );
}
