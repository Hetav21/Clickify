import express from "express";
import { JwtPayload } from "../../common/types/JwtPayload";
import { getChartData, getTableData } from "../../helpers/formatData";
import { response } from "../../helpers/response";

const router = express.Router();

router.get("/chart-data", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const id = jwtPayload.id;

    const chartData = await getChartData(id);

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Chart data extracted successfully",
        info: {
          chartData,
        },
      },
      200,
      res,
    );
    return;
  } catch (err) {
    // Catching the error in above process
    console.log(err);

    response({ success: false, message: "Internal server error" }, 500, res);
    return;
  }
});

router.get("/table-data", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const id = jwtPayload.id;

    const tableData = await getTableData(id);

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Table data extracted successfully",
        info: {
          tableData,
        },
      },
      200,
      res,
    );
    return;
  } catch (err) {
    // Catching the error in above process
    console.log(err);

    response({ success: false, message: "Internal server error" }, 500, res);
    return;
  }
});

export const analyticsRouter = router;
