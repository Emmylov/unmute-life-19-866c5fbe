
export const getInitials = (name?: string): string => {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
};

export const getAvatarFallbackColor = (userId?: string): string => {
  if (!userId) return "bg-unmute-purple";
  
  const colors = [
    "bg-unmute-purple", "bg-unmute-pink", "bg-unmute-lavender", 
    "bg-unmute-blue", "bg-unmute-mint"
  ];
  
  const index = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};
