import { OpenFarm } from "./openfarm";
import { DropDownItem } from "../ui/index";
import { CowardlyDictionary } from "../util";
import {
  TaggedFarmEvent,
  TaggedSequence,
  TaggedRegimen,
  TaggedGenericPointer,
  TaggedPlantPointer,
  TaggedCrop,
} from "../resources/tagged_resources";
import { PlantPointer } from "../interfaces";
import { SlotWithTool } from "../resources/interfaces";
import { BotPosition } from "../devices/interfaces";
import { isNumber } from "lodash";

/** TODO: Use Enums */
export type BotOriginQuadrant = 1 | 2 | 3 | 4;
export type ZoomLevelPayl = 0.1 | -0.1;

type Mystery = BotOriginQuadrant | number | undefined;
export function isBotOriginQuadrant(mystery: Mystery):
  mystery is BotOriginQuadrant {
  return isNumber(mystery) && [1, 2, 3, 4].includes(mystery);
}

export interface State {
  legendMenuOpen: boolean;
  showPlants: boolean;
  showPoints: boolean;
  showSpread: boolean;
  showFarmbot: boolean;
}

export interface Props {
  dispatch: Function;
  selectedPlant: TaggedPlantPointer | undefined;
  designer: DesignerState;
  hoveredPlant: TaggedPlantPointer | undefined;
  points: TaggedGenericPointer[];
  plants: TaggedPlantPointer[];
  toolSlots: SlotWithTool[];
  crops: TaggedCrop[];
  botPosition: BotPosition;
}

export type TimeUnit =
  | "never"
  | "minutely"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type ExecutableType = "Sequence" | "Regimen";

export interface FarmEvent {
  id?: number | undefined;
  start_time: string;
  end_time?: string | undefined;
  repeat?: number | undefined;
  time_unit: TimeUnit;
  executable_id: number;
  executable_type: ExecutableType;
}

export interface MovePlantProps {
  deltaX: number;
  deltaY: number;
  plant: TaggedPlantPointer;
}

/**
 * OFCrop bundled with corresponding profile image from OpenFarm API.
 */
export interface CropLiveSearchResult {
  crop: OpenFarm.OFCrop;
  image: string;
}

export interface Crop {
  id?: undefined;
  svg_icon?: string | undefined;
  spread?: number | undefined;
  slug: string;
}

export interface DesignerState {
  selectedPlant: string | undefined;
  hoveredPlant: HoveredPlantPayl;
  botOriginQuadrant: BotOriginQuadrant;
  zoomLevel: number;
  cropSearchQuery: string;
  cropSearchResults: CropLiveSearchResult[];
}

export type TaggedExecutable = TaggedSequence | TaggedRegimen;
export type ExecutableQuery = (kind: ExecutableType, id: number) => TaggedExecutable;
export interface AddEditFarmEventProps {
  deviceTimezone: string | undefined;
  executableOptions: DropDownItem[];
  repeatOptions: DropDownItem[];
  farmEvents: TaggedFarmEvent[];
  regimensById: CowardlyDictionary<TaggedRegimen>;
  sequencesById: CowardlyDictionary<TaggedSequence>;
  farmEventsById: CowardlyDictionary<TaggedFarmEvent>;
  getFarmEvent(): TaggedFarmEvent | undefined;
  formatDate(input: string): string;
  formatTime(input: string): string;
  handleTime(e: React.SyntheticEvent<HTMLInputElement>, currentISO: string): string;
  dispatch: Function;
  findExecutable: ExecutableQuery;
}

/**
 * One CalendarDay has many CalendarOccurrences. For instance, a FarmEvent
 * that executes every 8 hours will create 3 CalendarOccurrences in a single
 * CalendarDay.
 */
export interface CalendarOccurrence {
  mmddyy: string;
  sortKey: number;
  timeStr: string;
  heading: string;
  subheading?: string | undefined;
  executableId: number;
  id: number;
}

/** A group of FarmEvents for a particular day on the calendar. */
export interface CalendarDay {
  /** Unix timestamp. Used as a unique key in JSX and for sorting. */
  sortKey: number;
  year: number;
  month: string;
  day: number;
  /** Every event that will execute on that day. */
  items: CalendarOccurrence[];
}

export interface FarmEventProps {
  /** Sorted list of the first (100?) events due on the calendar. */
  calendarRows: CalendarDay[];
  /** Call this function to navigate to different pages. */
  push: (url: string) => void;
}

export interface GardenMapProps {
  showPlants: boolean | undefined;
  showPoints: boolean | undefined;
  showSpread: boolean | undefined;
  showFarmbot: boolean | undefined;
  dispatch: Function;
  designer: DesignerState;
  points: TaggedGenericPointer[];
  plants: TaggedPlantPointer[];
  toolSlots: SlotWithTool[];
  selectedPlant: TaggedPlantPointer | undefined;
  hoveredPlant: TaggedPlantPointer | undefined;
  crops: TaggedCrop[];
  botPosition: BotPosition;
}

export interface GardenMapState {
  isDragging: boolean | undefined;
  botOriginQuadrant: BotOriginQuadrant;
  pageX: number | undefined;
  pageY: number | undefined;
}

export interface GardenPlantProps {
  quadrant: BotOriginQuadrant;
  dispatch: Function;
  plant: Readonly<TaggedPlantPointer>;
  selected: boolean;
  dragging: boolean;
  onClick: (plant: Readonly<TaggedPlantPointer>) => void;
}

export interface GardenPlantState {
  icon: string;
}

export interface GardenPointProps {
  quadrant: BotOriginQuadrant;
  point: TaggedGenericPointer;
}

export type PlantOptions = Partial<PlantPointer>;

export interface EditPlantInfoProps {
  push(url: string): void;
  dispatch: Function;
  findPlant(stringyID: string | undefined): TaggedPlantPointer | undefined;
}

export interface DNDCropMobileState {
  isDragging: boolean;
}

export interface DraggableEvent {
  currentTarget: HTMLImageElement;
  dataTransfer: {
    setDragImage: Function;
  };
}

export interface HoveredPlantPayl {
  /* Use UUID here to prevent denormalization? */
  plantUUID: string | undefined;
  icon: string;
}

export interface CropCatalogProps {
  cropSearchQuery: string;
  dispatch: Function;
  cropSearchResults: CropLiveSearchResult[];
  OFSearch: (searchTerm: string) =>
    (dispatch: Function) => void;
}

export interface CropInfoProps {
  dispatch: Function;
  cropSearchResults: CropLiveSearchResult[];
  OFSearch: (query: string) => (dispatch: Function) => void;
}
