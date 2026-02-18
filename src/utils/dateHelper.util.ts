const now = new Date();

const startOfDay = new Date(now);
startOfDay.setHours(0,0,0,0);

const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay());
startOfWeek.setHours(0,0,0,0);

const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
