import React from "react";
import { useApp } from "@/contexts/AppContext";

const MonthFilter = () => {
    const { selectedMonth, setSelectedMonth } = useApp();

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="flex flex-col space-y-2">
            <label htmlFor="month-filter" className="text-sm font-medium text-muted-foreground">
                Filtrar por mês
            </label>
            <select
                id="month-filter"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-foreground"
            >
                {Array.from({ length: 12 }).map((_, index) => {
                    const date = new Date();
                    date.setMonth(index);
                    const month = date.toISOString().slice(0, 7); // Format: YYYY-MM
                    return (
                        <option key={month} value={month}>
                            {date.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default MonthFilter;