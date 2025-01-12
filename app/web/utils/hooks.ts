import { Coordinates } from "features/search/constants";
import { LngLat } from "maplibre-gl";
import { useRouter } from "next/navigation";
import Sentry from "platform/sentry";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  filterDuplicatePlaces,
  NominatimPlace,
  simplifyPlaceDisplayName,
} from "utils/nominatim";

// Locations having one of these keys are considered non-regions.
// https://nominatim.org/release-docs/latest/api/Output/#addressdetails
const nonRegionKeys = [
  "municipality",
  "city",
  "town",
  "village",
  "city_district",
  "district",
  "borough",
  "suburb",
  "subdivision",
];

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

function useSafeState<State>(
  isMounted: MutableRefObject<boolean>,
  initialState: State | (() => State)
): [State, Dispatch<SetStateAction<State>>] {
  const [state, setState] = useState(initialState);

  const safeSetState = useCallback(
    (newState: SetStateAction<State>) => {
      if (isMounted.current) {
        setState(newState);
      }
    },
    [isMounted]
  );

  return [state, safeSetState];
}

export interface GeocodeResult {
  name: string;
  simplifiedName: string;
  location: LngLat;
  bbox: Coordinates;
  isRegion?: boolean;
}

const NOMINATIM_URL = process.env.NEXT_PUBLIC_NOMINATIM_URL;

const useGeocodeQuery = () => {
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useSafeState(isMounted, false);
  const [error, setError] = useSafeState<string | undefined>(
    isMounted,
    undefined
  );
  const [results, setResults] = useSafeState<GeocodeResult[] | undefined>(
    isMounted,
    undefined
  );

  const query = useCallback(
    async (value: string) => {
      if (!value) {
        return;
      }
      setIsLoading(true);
      setError(undefined);
      setResults(undefined);
      const url = `${NOMINATIM_URL!}search?format=jsonv2&q=${encodeURIComponent(
        value
      )}&addressdetails=1`;
      const fetchOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      };
      try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) throw Error(await response.text());

        const nominatimResults: NominatimPlace[] = await response.json();

        if (nominatimResults.length === 0) {
          setResults([]);
        } else {
          const filteredResults = filterDuplicatePlaces(nominatimResults);
          const formattedResults = filteredResults.map((result) => {
            const firstElem = result["boundingbox"].shift() as number;
            const lastElem = result["boundingbox"].pop() as number;
            result["boundingbox"].push(firstElem);
            result["boundingbox"].unshift(lastElem);

            return {
              location: new LngLat(
                Number(result["lon"]),
                Number(result["lat"])
              ),
              name: result["display_name"],
              simplifiedName: simplifyPlaceDisplayName(result),
              isRegion: !nonRegionKeys.some((k) => k in result.address),
              bbox: result["boundingbox"],
            };
          });

          setResults(formattedResults);
        }
      } catch (e) {
        Sentry.captureException(e, {
          tags: {
            hook: "useGeocodeQuery",
          },
        });
        setError(e instanceof Error ? e.message : "");
      }
      setIsLoading(false);
    },
    [setError, setIsLoading, setResults]
  );

  return { isLoading, error, results, query };
};

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function useUnsavedChangesWarning({
  isDirty,
  isSubmitted,
  warningMessage,
}: {
  isDirty: boolean;
  isSubmitted: boolean;
  warningMessage: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      // This will trigger a confirmation dialog in most browsers
      e.preventDefault();
    };

    const handleBrowseAway = (url: string) => {
      if (!isDirty || isSubmitted) return;
      if (window.confirm(warningMessage)) {
        // Proceed with navigation
        router.push(url);
      } else {
        // Prevent navigation
        throw new Error("Cancelled due to unsaved changes");
      }
    };

    // Listen for the `beforeunload` event for browser tab close/refresh
    window.addEventListener("beforeunload", handleWindowClose);

    // Intercept navigation with manual confirmation
    const originalPush = router.push;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push = (url: string, ...args: any) => {
      handleBrowseAway(url);
      return originalPush(url, ...args);
    };

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.push = originalPush; // Restore original push method
    };
  }, [isDirty, isSubmitted, warningMessage, router]);
}

export {
  useGeocodeQuery,
  useIsMounted,
  usePrevious,
  useSafeState,
  useUnsavedChangesWarning,
};
