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
            alert("Request sent or joined!");
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
            alert("Group created successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    return (
        <div className="groups-container">
            <div className="groups-card">
                <div className="groups-header">
                    <h2>Group List</h2>
                </div>

                {/* 🔹 CREATE GROUP FORM */}
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
                        Private
                    </label>
                    <button type="submit">Create Group</button>
                </form>

                {/* 🔹 GROUP LIST */}
                <ul className="group-list">
                    {uniqueGroups.map((group) => (
                        <li key={group.id} className="group-item">
                            <strong>{group.name}</strong> - {group.private ? "Private" : "Public"} - {group.memberCount} members
                            <div>
                                {memberships[group.id]?.role ? (
                                    memberships[group.id].role === "PENDING" ? (
                                        <button disabled>Pending...</button>
                                    ) : memberships[group.id].role === "NOT_MEMBER" ? (
                                        <button onClick={() => handleJoin(group.id)}>Join</button>
                                    ) : (
                                        <button disabled>View Group ({memberships[group.id].role})</button>
                                    )
                                ) : (
                                    <button onClick={() => handleJoin(group.id)}>Join</button>
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
