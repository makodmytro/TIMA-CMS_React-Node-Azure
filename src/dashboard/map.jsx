import React from 'react';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
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

const clamp = (n) => Math.min(Math.max(n, 100000), 10000000);

const Map = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [map, setMap] = React.useState(null);
  const mapRef = React.useRef();

  const createMap = (data) => {
    try {
      const mapped = data
        .reduce((acc, cur) => {
          const code = cur.clientCountry.toLowerCase().trim();
          const match = CountryCodeToCoodrinates.find((country) => {
            return (
              country.alpha2.toLowerCase() === code || country.alpha3.toLowerCase() === code
              || country.country.toLowerCase() === code
            );
          });

          if (!match) {
            return acc;
          }

          const { latitude, longitude } = match;
          const radius = clamp(
            cur.sessionsCount
              ? cur.sessionsCount * 10000
              : 10000,
          );

          if (!acc[match.alpha2]) {
            acc[match.alpha2] = {
              latitude,
              longitude,
              radius,
              country: cur.clientCountry,
              sessionsCount: cur.sessionsCount,
            };
          }

          acc[match.alpha2].radius += radius;

          return acc;
        }, {});

      const features = Object.keys(mapped).map((key) => {
        const {
          latitude, longitude, radius, country, sessionsCount,
        } = mapped[key];

        const circle = new OlGeom.Circle(OlProj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'), radius);

        const feature = new Ol.Feature({
          geometry: circle,
          name: `${country}: ${sessionsCount}`,
        });

        return feature;
      });

      const vectorSource = new OlSourceVector({
        features,
      });

      const style = new OlStyle.Style({
        fill: new OlStyle.Fill({
          color: 'rgba(191, 38, 38, 0.3)',
        }),
        stroke: new OlStyle.Stroke({
          width: 3,
          color: 'rgba(191, 38, 38, 0.8)',
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
      });

      const options = {
        view: new Ol.View({
          zoom: 2,
          center: [0, 0],
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
        const [feat] = await vectorLayer.getFeatures(pixel);

        if (!feat) {
          overlay.setPosition(null);

          return;
        }

        const coordinates = feat.getGeometry().getCenter();
        el.innerHTML = feat.getProperties().name;

        overlay.setPosition(coordinates);
      };

      mapObject.on('pointermove', function (evt) { // eslint-disable-line
        if (evt.dragging) {
          return;
        }

        const pixel = mapObject.getEventPixel(evt.originalEvent);

        displayFeatureInfo(pixel);
      });

      setMap(mapObject);
    } catch (err) { // eslint-disable-line
      console.log(err);
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
      {
        !map && (
          <Typography align="center">Loading...</Typography>
        )
      }
      <div ref={mapRef} style={{ height: '50vh' }} />
    </Box>
  );
};

export default Map;
