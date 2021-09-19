import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { Typography, Box, Button, Slider } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { defaultFilters } from "pages/index";
import type { FiltersType } from "types";

const FiltersRoot = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;

  @media (min-width: ${(p) => p.theme.breakpoints.values.sm}px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
  }
`;

const StyledSlider = styled(Slider)`
  color: ${(p) => p.theme.palette.text.secondary};

  .MuiSlider-thumb:hover,
  .MuiSlider-thumb.Mui-focusVisible {
    box-shadow: 0px 0px 0px 8px rgb(225 225 225 / 16%);
  }
`;

const sliderMarks = Array.from({ length: 6 }, (_, i) => ({
  value: i * 20,
  label: i * 20,
}));

type Props = {
  changeFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
};

const Filters = ({ changeFilters }: Props) => {
  const [sortBy, setSortBy] = useState<FiltersType["sortBy"]>(
    defaultFilters.sortBy
  );
  const [sortOrder, setSortOrder] = useState<FiltersType["sortOrder"]>(
    defaultFilters.sortOrder
  );
  const [minCount, setMinCount] = useState(defaultFilters.minCount);
  const minCountRef = useRef(minCount);

  const handleSortButtonClick = (name: FiltersType["sortBy"]) => () => {
    const isClickOnTheSameButton = sortBy === name;

    if (isClickOnTheSameButton) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder(defaultFilters.sortOrder);
    }

    setSortBy(name);
  };

  const getEndIcon = (name: FiltersType["sortBy"]) => {
    if (sortBy !== name) return null;

    return sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
  };

  useEffect(() => {
    changeFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  }, [sortBy, sortOrder]);

  const debouncedChangeFilters = useMemo(
    () =>
      debounce(
        () =>
          changeFilters((prev) => ({ ...prev, minCount: minCountRef.current })),
        500
      ),
    []
  );

  useEffect(() => {
    minCountRef.current = minCount;
    debouncedChangeFilters();
  }, [minCount]);

  return (
    <FiltersRoot>
      <Box sx={{ mr: 2, mb: 2 }}>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          Сортировать по:
        </Typography>
        <Typography color="textPrimary">
          <Button
            variant="text"
            size="small"
            color="inherit"
            endIcon={getEndIcon("date")}
            sx={{ mr: 1, minWidth: 0 }}
            onClick={handleSortButtonClick("date")}
          >
            Дата
          </Button>
          <Button
            variant="text"
            size="small"
            color="inherit"
            endIcon={getEndIcon("count")}
            sx={{ mr: 1 }}
            onClick={handleSortButtonClick("count")}
          >
            Количество
          </Button>
          <Button
            variant="text"
            size="small"
            color="inherit"
            endIcon={getEndIcon("rating")}
            onClick={handleSortButtonClick("rating")}
          >
            Рейтинг
          </Button>
        </Typography>
      </Box>
      <Box sx={{ width: 240, pr: 2 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          id="min-rating"
          gutterBottom
        >
          Минимальное количество:
        </Typography>
        <StyledSlider
          value={minCount}
          onChange={(e, newValue) => setMinCount(newValue as number)}
          aria-labelledby="min-count"
          step={10}
          min={0}
          max={100}
          marks={sliderMarks}
        />
      </Box>
    </FiltersRoot>
  );
};

export default Filters;
