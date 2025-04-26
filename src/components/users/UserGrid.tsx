
import React from "react";
import { motion } from "framer-motion";
import UserCard from "./UserCard";

interface UserGridProps {
  users: any[];
  featured?: boolean;
  trending?: boolean;
}

const UserGrid = ({ users, featured = false, trending = false }: UserGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {users.map((user) => (
        <motion.div key={user.id} variants={item}>
          <UserCard user={user} featured={featured} trending={trending} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserGrid;
