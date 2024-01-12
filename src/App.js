// import React, { useState } from "react";
// import {
//   APIProvider,
//   Map,
//   AdvancedMarker,
//   Pin,
//   InfoWindow,
// } from "@vis.gl/react-google-maps";

// const Intro = () => {
//   const position = { lat: 26.867840, lng: 80.996170 };
//   const [open, setOpen] = useState(false);

//   return (
//     <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//       <div style={{ height: "100vh", width: "100%" }}>
//         <Map zoom={9} center={position} mapId={process.env.REACT_APP_MAP_ID}>
//           <AdvancedMarker position={position} onClick={() => setOpen(true)}>
//             <Pin background={"red"} borderColor={"green"} glyphColor={"purple"} />
//           </AdvancedMarker>

//           {open && (
//             <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
//               <p>I'm in Gomti Nagar Vibhuti Khand Lucknow</p>
//             </InfoWindow>
//           )}
//         </Map>
//       </div>
//     </APIProvider>
//   );
// };

// export default Intro;

import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const Intro = () => {
  const initialPosition = { lat: 53.54, lng: 10 };
  const [open, setOpen] = useState(false);

  // Array of marker positions with names
  const markers = [
    { position: { lat: 53.54, lng: 10 }, name: "Marker 1" },
    { position: { lat: 53.55, lng: 10.1 }, name: "Marker 2" },
    { position: { lat: 53.56, lng: 10.2 }, name: "Marker 3" },
    // Add more markers with names as needed
  ];

  const handleMarkerClick = () => {
    setOpen(true);
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>

      <div style={{ height: "100vh", width: "100%" }}>


        <Map zoom={9} center={initialPosition} mapId={process.env.REACT_APP_MAP_ID}>


          {markers.map((marker, index) => (
            <React.Fragment key={index}>


              <AdvancedMarker position={marker.position} onClick={handleMarkerClick}>
                <Pin background={"red"} borderColor={"green"} glyphColor={"purple"} />
              </AdvancedMarker>


              {open && (
                <InfoWindow
                  position={marker.position}
                  onCloseClick={() => setOpen(false)}
                >
                  <p>{marker.name}</p>
                </InfoWindow>
              )}


            </React.Fragment>
          ))}


        </Map>


      </div>

    </APIProvider>
  );
};

export default Intro;
