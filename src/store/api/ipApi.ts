//import { createSelector } from '@reduxjs/toolkit';
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { type GeoLocation } from '../../types/geoLocation';
import { createSelector } from '@reduxjs/toolkit';

const ipApi = createApi({
  reducerPath: 'ip',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://ip-api.com' // to use https needs server serving https
  }),
  tagTypes: ['CurrentUser'],
  endpoints(builder) {
    return {
      geolocationByIp: builder.query<GeoLocation, string>({
        providesTags: () => {
          return [{ type: 'CurrentUser' }];
        },
        query: (ip) => {
          return {
            url: `json/${ip}?fields=status,message,country,countryCode`,
            method: 'GET'
          };
        }
      }),
      geolocation: builder.query<GeoLocation, void>({
        providesTags: () => {
          return [{ type: 'CurrentUser' }];
        },
        query: () => {
          return {
            url: `json/?fields=query,status,message,city,regionName,country,countryCode,zip,lat,lon,timezone`,
            method: 'GET'
          };
        }
      })

    };
  }
});

const selectGeoLocationResult = ipApi.endpoints.geolocation.select();

export const selectGeoLocation = createSelector(
  selectGeoLocationResult,
  (geoLocation) => geoLocation.data
);

export const {
  useGeolocationByIpQuery,
  useGeolocationQuery,
} = ipApi;
export { ipApi };