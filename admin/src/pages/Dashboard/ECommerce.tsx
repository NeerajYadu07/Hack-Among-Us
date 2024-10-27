import React, { useEffect, useState } from 'react';
import { User } from '../../types/types';
// import axios from 'axios';
// import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
// import ChartThree from '../../components/Charts/ChartThree';
// import ChartTwo from '../../components/Charts/ChartTwo';
// import ChatCard from '../../components/Chat/ChatCard';
// import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import MapComponent from '../../components/MapComponent';
import Posts from '../../components/Tables/Posts';
import CardDataStats from '../../components/CardDataStats';
import axios from 'axios';

interface GeoLocation {
  ip: string;
  city_name: string;
  lat: number;
  lng: number;
}

const ECommerce: React.FC = () => {
  // const API_KEY = import.meta.env.MAP_API_KEY;
  const [geoLocations, setGeoLocations] = useState<[GeoLocation]>([
    {
      ip: '14.139.61.195',
      city_name: 'Raipur',
      lat: 21.23333,
      lng: 81.63333,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [flaggedUsers, setFlaggedUsers] = useState<[User] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/v1/admin/getgeolocation/`,
          selectedUser?.loginIps,
        );
        if (response.status !== 200) {
          throw new Error('Failed to fetch geo location');
        }
        const data: [GeoLocation] = await response.data;
        console.log(data);
        // setGeoLocations(data);
      } catch (err) {}
    };
    fetchGeoLocation();

    const getFlaggedUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/flagged`,
        );
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to get flagged users');
        }
        const data: [User] = await response.json();
        console.log(data);
        setFlaggedUsers(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    getFlaggedUsers();
  }, [loading, selectedUser]); // Empty dependency array to run once on mount

  const handleDisable = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/disable`,
        {
          id: selectedUser?._id,
        },
      );
      console.log(response);
      if (response.status !== 200) {
        throw new Error('Failed to get disable user');
      }
      setLoading(false);
      setSelectedUser(null);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading</div>;
  return (
    <>
      <div className="grid grid-cols-12 gap-4  md:gap-6  2xl:gap-7.5">
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        {/* <MapOne /> */}
        {selectedUser && (
          <>
            <div className="col-span-12">
              <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                  <div className="p-2.5 xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      {selectedUser.username}
                    </h5>
                  </div>

                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      {selectedUser.email}
                    </h5>
                  </div>

                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      {selectedUser.loginIps[0]}
                    </h5>
                  </div>

                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      {selectedUser.flaggedPosts.length} posts {', '}
                      {selectedUser.flaggedComments.length} comments
                    </h5>
                  </div>

                  <div className="hidden p-2.5 text-center sm:block xl:p-5 bg-red-500">
                    <button onClick={handleDisable}>Disable Account</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-7xl col-span-5 flex justify-center">
              <MapComponent locations={geoLocations} />
            </div>
            <div className="col-span-7">
              <ChartOne />
            </div>
          </>
        )}
        <div className="col-span-12">
          {!selectedUser ? (
            flaggedUsers &&
            flaggedUsers.length > 0 && (
              <TableOne
                flaggedUsers={flaggedUsers}
                setSelectedUser={setSelectedUser}
              />
            )
          ) : (
            <Posts user={selectedUser} setSelectedUser={setSelectedUser} />
          )}
        </div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;
