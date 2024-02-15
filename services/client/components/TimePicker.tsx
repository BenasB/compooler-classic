import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface Props {
  time: Date;
  onChange: (newDate: Date) => void;
}

const TimePickerNative: React.FC<Props> = ({ time, onChange }) => {
  return (
    <DateTimePicker
      value={time}
      onChange={(e, d) => onChange(d || new Date())}
      mode="time"
    />
  );
};

const TimePickerWeb: React.FC<Props> = ({ time, onChange }) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  return (
    <input
      type="time"
      value={formattedTime}
      onChange={(e) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        const newTime = new Date();
        newTime.setHours(hours);
        newTime.setMinutes(minutes);
        onChange(newTime);
      }}
      style={{
        borderRadius: 5,
        border: "none",
        padding: "0 10px",
        fontFamily: "sans-serif",
      }}
    ></input>
  );
};

export default Platform.select({
  native: TimePickerNative,
  web: TimePickerWeb,
}) || TimePickerNative;
