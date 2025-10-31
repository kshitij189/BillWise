import React from "react";
import ReactApexChart from "react-apexcharts";

function Chart({ paymentHistory }) {
  // Robust data extraction
  let paymentDates = [];
  let paymentReceived = [];

  for (const record of paymentHistory) {
    const rawDate = record?.datePaid;
    const amount = record?.amountPaid || 0;

    // Ensure valid date before adding
    const parsedDate = new Date(rawDate);
    if (!isNaN(parsedDate.getTime())) {
      paymentDates.push(parsedDate.toISOString()); 
      paymentReceived.push(amount);
    } else {
      console.warn("Invalid date detected in paymentHistory:", rawDate);
    }
  }

  const series = [
    {
      name: "Payment Received",
      data: paymentReceived,
    },
  ];

  const options = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime", 
      categories: paymentDates,
      labels: {
      style: {
        fontSize: '1.2rem',    // Increase this for bigger x-axis labels
        fontWeight: 600,
      }}
    },
    yaxis: {
    labels: {
      style: {
        fontSize: '1.2rem',   // Make y-axis tick numbers larger
        fontWeight: 600,
      }
    },
    title: {
      style: {
        fontSize: '1.1rem',
        fontWeight: 700,
      }
    }
  },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
       style: {
      fontSize: '1rem',   // Make tooltip text much bigger
      fontWeight: 500,
    }
    },
    colors: ["#1976d2"],
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        width: "98%",
        margin: "10px auto",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        minHeight: "380px"
      }}
    >
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
      />
    </div>
  );
}

export default Chart;
