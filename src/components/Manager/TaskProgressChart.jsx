import React from "react";

function TaskProgressChart({ data }) {
  // const data = {
  //   done_tasks: 288,
  //   todo_tasks: 160,
  //   overdue_tasks: 8,
  // };

  const done = data?.done_tasks || 0;
  const todo = data?.todo_tasks || 0;
  const overdue = data?.overdue_tasks || 0;

  const total = done + todo + overdue;

  const rawValues = [
    total ? Math.round((overdue / total) * 100) : 0,
    total ? Math.round((todo / total) * 100) : 0,
    total ? Math.round((done / total) * 100) : 0,
  ];
  rawValues.push(100 - rawValues[0] - rawValues[1]);

  const chartData = [
    {
      label: "Overdue",
      value: rawValues[0],
      count: overdue,
      color: "bg-pink-500",
      light: "bg-pink-200",
    },
    {
      label: "Todo",
      value: rawValues[1],
      count: todo,
      color: "bg-blue-500",
      light: "bg-blue-200",
    },
    {
      label: "Done",
      value: rawValues[2],
      count: done,
      color: "bg-green-500",
      light: "bg-green-200",
    },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);
  const average = total ? rawValues[2] : 0;

  const CONTAINER_H = 200;

  const positions = [
    "left-0 bottom-0 z-0",
    "left-[100px] bottom-0 z-10",
    "left-[200px] bottom-0 z-20",
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between flex-1">
      {/* Top */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-medium text-gray-800">Task Progress</h2>
          <h1 className="text-6xl font-semibold mt-4">{average}%</h1>
          <p className="text-gray-400 text-sm mt-1">Done task percentage</p>
        </div>

        {/* Legends */}
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${item.color}`} />
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4" style={{ height: `${CONTAINER_H}px` }}>
        {chartData.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * CONTAINER_H, 90);

          return (
            <div
              key={index}
              className={`absolute w-37.5 rounded-[28px] ${item.color} shadow-lg overflow-hidden ${positions[index]}`}
              style={{ height: `${barHeight}px` }}
            >
              {/* Top bubble */}
              <div className="absolute top-3 left-3 bg-white/20 border border-white/30 backdrop-blur-sm text-white text-xs w-10 h-10 rounded-full flex items-center justify-center">
                {item.value}
              </div>

              {/* Striped bottom */}
              <div
                className={`absolute bottom-1.5 left-1.5 right-1.5 ${item.light} opacity-80 rounded-[22px] border border-white/30`}
                style={{
                  top: "60px", // ← always starts below the bubble (top-3 + h-10 = 12 + 40 = 52px, so 60px gives breathing room)
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 2px, transparent 2px, transparent 6px)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskProgressChart;
