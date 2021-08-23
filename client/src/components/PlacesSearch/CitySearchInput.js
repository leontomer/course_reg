import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import TextField from "@material-ui/core/TextField";
import "./Places.css";
global.city = "";

const CitySearchInput = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element

    setValue(e.target.value);
    global.city = e.target.value;
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      global.city = description;

      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log("📍 Coordinates: ", { lat, lng });
        })
        .catch((error) => {
          console.log("😱 Error: ", error);
        });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div className="div" ref={ref}>
      <div>
        <TextField
          className="textField"
          label="עיר"
          value={value}
          size="small"
          onChange={handleInput}
          variant="outlined"
        />
      </div>

      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default CitySearchInput;
