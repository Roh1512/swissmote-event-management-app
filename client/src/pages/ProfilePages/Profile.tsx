import React from "react";
import { useGetProfileQuery } from "@/features/profile/profileApiSlice";
import PageLoading from "@/components/Loading/PageLoading";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/themeComponents/ToggleTheme";
import LogoutButton from "@/components/Logout/LogoutButton";

const Profile: React.FC = () => {
  const { data: profileData, isLoading, error } = useGetProfileQuery();

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-red-500">Error loading profile.</span>
      </div>
    );
  }

  // Format dates for display
  const formattedCreatedAt = new Date(
    profileData.createdAt
  ).toLocaleDateString();
  const formattedUpdatedAt = new Date(
    profileData.updatedAt
  ).toLocaleDateString();

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
        <h4>Profile Details</h4>
        <figure className="px-10 pt-10">
          {profileData.profileImgUrl ? (
            <img
              src={profileData.profileImgUrl}
              alt={profileData.username}
              className="rounded-full w-32 h-32 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="rounded-full w-32 h-32 flex items-center justify-center bg-gray-300 text-gray-700 text-3xl">
              {profileData.username.charAt(0).toUpperCase()}
            </div>
          )}
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold">
            {profileData.username}
          </h2>
          <p className="text-base">{profileData.email}</p>
          <br />
          <LogoutButton />
          <div className="flex gap-2 mt-2">
            <div className="badge badge-info">
              Member since: {formattedCreatedAt}
            </div>
            <div className="badge badge-secondary">
              Updated: {formattedUpdatedAt}
            </div>
          </div>
          {profileData.eventsAttendingIds &&
            profileData.eventsAttendingIds.length > 0 && (
              <div className="mt-4 w-full">
                <h3 className="text-lg font-semibold">Attending Events</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.eventsAttendingIds.map((eventId) => (
                    <span key={eventId} className="badge badge-outline">
                      {eventId}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
      <br />
      <div>
        <Link className="btn btn-secondary text-lg" to="/myevents">
          Manage Your Events
        </Link>
      </div>
      <br />
      <div className="flex gap-2 items-center justify-center font-semibold text-lg">
        <span>Change Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Profile;
