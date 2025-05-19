import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GroupsPage.css';

interface Group {
    id: number;
    name: string;
    private: boolean;
    memberCount: number;
}

interface Membership {
    role: string;
}

const GroupListPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [memberships, setMemberships] = useState<{ [key: number]: Membership }>({});
    const [newGroupName, setNewGroupName] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const uniqueGroups = groups.filter(
        (group, index, self) => self.findIndex(g => g.id === group.id) === index
    );

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/group");
                console.log("Fetched Groups:", data);
                setGroups(data);
            } catch (error) {
                console.error("Failed to load groups", error);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        if (groups.length === 0 || !userData?.id) return;

        const fetchMemberships = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No authentication token found!");
                return;
            }

            const membershipPromises = groups.map(async (group) => {
                try {
                    const { data } = await axios.get(
                        `http://localhost:3000/api/group/me/${group.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return { [group.id]: data };
                } catch {
                    return { [group.id]: { role: "NOT_MEMBER" } };
                }
            });

            const membershipResults = await Promise.all(membershipPromises);
            setMemberships(Object.assign({}, ...membershipResults));
        };

        fetchMemberships();
    }, [groups]);

    const handleJoin = async (groupId: number) => {
        try {
            await axios.post(`http://localhost:3000/api/group/me/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to join group", error);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:3000/api/group`,
                { name: newGroupName, private: isPrivate },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            window.location.reload();
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    const handleLeaveGroup = async (groupId: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/group/me/${groupId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            window.location.reload();
        } catch (error: any) {
            const message = error.response?.data?.message;

            if (message === 'As a group owner, You need to delete the group, or request your demotion from another group owner!') {
                alert('You are the owner of this group. You must delete the group or be demoted by another owner before leaving.');
            } else if (message === 'Group not found!') {
                alert('This group no longer exists.');
            } else if (message === 'Cannot remove the owner of the group!') {
                alert('You cannot remove the group owner.');
            } else {
                alert(message || 'Failed to leave group');
            }

            console.error("Error leaving group:", error);
        }
    };


    const handleDeleteGroup = async (groupId: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/group/one/${groupId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete group");
            console.error("Error deleting group", error);
        }
    };

    return (
        <div className="groups-container">
            <div className="groups-card">
                <div className="groups-header">
                    <h2>Group List</h2>
                </div>

                <form className="create-group-form" onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <p>Private</p>
                    </label>
                    <button type="submit">Create Group</button>
                </form>

                <ul className="group-list">
                    {groups.map((group) => (
                        <li key={group.id} className="group-item">
                            <h2 className="group-link">{group.name}</h2>
                            <span>{group.private ? "Private" : "Public"} - {group.memberCount} members</span>
                            <div>
                                {memberships[group.id]?.role === "NOT_MEMBER" ? (
                                    <button onClick={() => handleJoin(group.id)}>Join</button>
                                ) : memberships[group.id]?.role === "OWNER" ? (
                                    <>
                                        <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                                        <button onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupListPage;
