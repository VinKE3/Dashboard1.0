import { Icon } from "./Icon";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const FiltroGlobal = ({
  textLabel,
  inputPlaceHolder,
  inputId,
  inputName,
  inputMax,
  botonId,
  filter,
  setFilter,
}) => {
  return (
    <div className="w-50 p-1 text-sm rounded-1 bg-gray-100">
      <div className="w-full flex rounded-2 border-2 border-gray-400 overflow-hidden">
        <label className="leading-9 px-3 bg-gray-600">{textLabel}</label>

        <input
          type="text"
          className="flex-1 pl-2 text-black"
          placeholder={inputPlaceHolder}
          id={inputId}
          name={inputName}
          maxLength={inputMax}
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />

        <button
          className="btn h-100 rounded-none bg-green-700 text-white hover:bg-green-500"
          id={botonId}
        >
          <Icon className="" icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};

export default FiltroGlobal;
