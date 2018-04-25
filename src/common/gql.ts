/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type UserRole =
  "GUEST" |
  "ARCHITECT" |
  "MANAGER" |
  "ADMIN" |
  "OPERATOR";


export type InOut =
  "IN" |
  "OUT";


export type LoginMutation = {
  Login:  {
    // User UUID
    uuid: string | null,
    // username used for login
    username: string | null,
    // user role
    role: UserRole,
    // JWT token
    jwtAuthToken: string,
  },
};

export type UserActivitiesQuery = {
  // Activities for user. JWT header required
  userActivities:  Array< {
    dateStart: string,
    dateEnd: string,
    activityId: number,
    activity:  {
      description: string,
    },
  } | null > | null,
};

export type UserCheckinsQuery = {
  // Checkins for user. JWT header required
  userCheckins:  Array< {
    id: string | null,
    pendingId: string | null,
    datetime: string,
    inOut: InOut,
    location:  {
      id: string | null,
      description: string,
      area:  {
        description: string,
      },
    },
    activity:  {
      id: string | null,
      description: string,
    },
  } | null > | null,
};

export type UserLocationsQuery = {
  // Locations for user. JWT header required
  userLocations:  Array< {
    dateStart: string,
    dateEnd: string,
    locationId: number,
    location:  {
      description: string,
      code: string,
      area:  {
        id: string | null,
        description: string,
      },
    },
  } | null > | null,
};

export type UserProfileQuery = {
  // Current user. JWT header required
  user:  {
    role: UserRole,
    email: string,
    fullName: string | null,
    birthdate: string | null,
    age: number | null,
  } | null,
};
/* tslint:enable */
