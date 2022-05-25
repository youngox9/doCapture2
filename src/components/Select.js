import React, { useEffect, useState } from "react";
import Select from "react-select";

function CustomSelect(props) {
  return (
    <Select
      {...props}
      menuPosition="fixed"
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
    // styles={customStyles}
    />
  );
}

export default CustomSelect;
