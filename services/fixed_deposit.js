const db = require("./db");
const helper = require("../helper");
const config = require("../config/config");

async function getById(id) {
  const result = await db.query(`SELECT * FROM fixed_deposit WHERE fd_id=?`, [id]);

  const data = helper.emptyOrRows(result);

  return { data };
}
async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM fixed_deposit LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}
async function create(fixed_deposit) {
  const result = await db.query(
    "INSERT INTO fixed_deposit (user_id, saving_account_id, duration, rate_per_annum, fd_opening_date, amount) VALUES (?, ?, ?, ?, ?, ?)",
    [
      fixed_deposit.user_id,
      fixed_deposit.saving_account_id,
      fixed_deposit.duration,
      fixed_deposit.rate_per_annum,
      fixed_deposit.fd_opening_date,
      fixed_deposit.amount
    ]
  );

  let message = "Error in creating the fixed_deposit!";

  if (result.affectedRows) {
    message = "fixed_deposit created successfully!";
  }

  return { message };
}

async function update(id, fixed_deposit) {
  let message = "fixed_deposit not found";
  if (getById(id)) {
    const result = await db.query(
      "UPDATE fixed_deposit SET user_id=?, saving_account_id=?, duration=?, rate_per_annum=?, fd_opening_date=?, amount=? WHERE fd_id=?",
      [
        fixed_deposit.user_id,
        fixed_deposit.saving_account_id,
        fixed_deposit.duration,
        fixed_deposit.rate_per_annum,
        fixed_deposit.fd_opening_date,
        fixed_deposit.amount,
        id,
      ],
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    if (result.affectedRows) {
      message = "fixed_deposit updated successfully";
    }
  } else {
    message = "Error in updating fixed_deposit";
  }

  return { message };
}

async function remove(id) {
  let message = "fixed_deposit not found";
  if (getById(id)) {
    const result = await db.query(`DELETE FROM fixed_deposit WHERE fixed_deposit_id=${id}`);
    if (result.affectedRows) {
      message = "fixed_deposit deleted successfully!";
    }
  } else {
    message = "Error in deleting fixed_deposit";
  }

  return { message };
}

module.exports = {
  getById,
  getMultiple,
  create,
  update,
  remove,
};
