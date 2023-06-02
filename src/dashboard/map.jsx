import React from 'react';
import { useDataProvider, useNotify } from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import * as Ol from 'ol';
import * as OlProj from 'ol/proj';
import OLTileLayer from 'ol/layer/Tile';
import OlVectorLayer from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlSourceOSM from 'ol/source/OSM';
import OlOverlay from 'ol/Overlay';
import * as OlGeom from 'ol/geom';
import * as OlStyle from 'ol/style';
import CountryCodeToCoodrinates from '../country-code-to-coordinates.json';
import MarkerRed from '../assets/marker-red.png';

const Map = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [map, setMap] = React.useState(null);
  const mapRef = React.useRef();

  const createMap = (data) => {
    try {
      const mapped = data.reduce((acc, cur) => {
        const code = (cur.clientCountry || '').toLowerCase().trim();
        const match = CountryCodeToCoodrinates.find((country) => {
          return country.alpha2.toLowerCase() === code || country.alpha3.toLowerCase() === code || country.country.toLowerCase() === code;
        });

        if (!match) {
          return acc;
        }

        const { latitude, longitude } = match;

        if (!acc[match.alpha2]) {
          acc[match.alpha2] = {
            latitude,
            longitude,
            country: cur.clientCountry,
            sessionsCount: cur.sessionsCount,
          };
        } else {
          acc[match.alpha2].sessionsCount += cur.sessionsCount;
        }

        return acc;
      }, {});

      let max = 0;
      let maxLocation = [0, 0];

      const features = Object.keys(mapped).map((key) => {
        const { latitude, longitude, country, sessionsCount } = mapped[key];

        const icon = new Ol.Feature({
          geometry: new OlGeom.Point(OlProj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')),
          name: `${country}: ${sessionsCount}`,
        });

        if (sessionsCount > max) {
          max = sessionsCount;
          maxLocation = OlProj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
        }

        return icon;
      });

      const vectorSource = new OlSourceVector({
        features,
      });

      const style = new OlStyle.Style({
        image: new OlStyle.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: MarkerRed,
        }),
      });

      const vectorLayer = new OlVectorLayer({
        source: vectorSource,
        style,
      });

      const el = document.createElement('div');
      el.className = 'ol-popup';

      const overlay = new OlOverlay({
        element: el,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
        positioning: 'top-center',
        offset: [0, -30],
      });

      const options = {
        view: new Ol.View({
          zoom: max > 0 ? 4 : 2,
          center: max > 0 ? maxLocation : [0, 0],
        }),
        layers: [
          new OLTileLayer({
            source: new OlSourceOSM(),
          }),
          vectorLayer,
        ],
        controls: [],
        overlays: [overlay],
      };
      const mapObject = new Ol.Map(options);

      mapObject.setTarget(mapRef.current);

      const displayFeatureInfo = async (pixel) => {
        try {
          const [feat] = await vectorLayer.getFeatures(pixel);

          if (!feat) {
            overlay.setPosition(null);

            return;
          }

          // const coordinates = feat.getGeometry().getCenter();
          const coordinates = feat.getGeometry().getCoordinates();
          el.innerHTML = feat.getProperties().name;

          overlay.setPosition(coordinates);
        } catch (err) {
          console.err(err); // eslint-disable-line
        }
      };

      mapObject.on('pointermove', (evt) => {
        // eslint-disable-line
        if (evt.dragging) {
          return;
        }

        const pixel = mapObject.getEventPixel(evt.originalEvent);

        displayFeatureInfo(pixel);
      });

      setMap(mapObject);
    } catch (err) {
      // eslint-disable-line
      console.log(err); // eslint-disable-line
    }
  };

  const fetch = async () => {
    try {
      const { data } = await dataProvider.sessionsMap();

      createMap(data.data);
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  const destroyMap = () => {
    if (map) {
      map.setTarget(undefined);
    }
  };

  React.useEffect(() => {
    fetch();

    return () => destroyMap();
  }, []);

  return (
    <Box mb={4} p={1} boxShadow={6}>
      {!map && <Typography align="center">Loading...</Typography>}
      <div ref={mapRef} style={{ height: '50vh' }} />
    </Box>
  );
};

export default Map;
