<%@ WebHandler Language="C#" Class="SubmitAccident" %>

using System;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Collections.Generic;
using System.Web.Script.Serialization;

public class SubmitAccident : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        string action = context.Request.QueryString["action"];
        context.Response.ContentType = "text/plain";

        if (action == "add")
        {
            // 从前端获取请求参数
            string Time = context.Request["time"];
            string x = context.Request["x"];
            string y = context.Request["y"];
            string description = context.Request["description"];

            // 连接字符串
            string dbName = "CampusWebGIS";
            string p_strUser = "sa";
            string p_strPWD = "12345678";
            string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "LAPTOP-0RHISCBR", dbName, p_strUser, p_strPWD);

            // SQL查询语句
            string insertSql = "INSERT INTO Accidents (TIME, X, Y, Descript) VALUES (@Time, @X, @Y, @Description)";

            try
            {
                using (SqlConnection conn = new SqlConnection())
                {
                    conn.ConnectionString = ConnectionString;
                    conn.Open();

                    using (SqlCommand command = new SqlCommand(insertSql, conn))
                    {
                        command.Parameters.AddWithValue("@Time", Time);
                        command.Parameters.AddWithValue("@X", x);
                        command.Parameters.AddWithValue("@Y", y);
                        command.Parameters.AddWithValue("@Description", description);

                        // 有行受影响，说明提交成功
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            context.Response.Write("提交成功");
                        }
                        else
                        {
                            context.Response.Write("提交失败");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                context.Response.Write("Error: " + ex.Message);
            }
        }
        else if (action == "query")
        {
            // 连接字符串
            string dbName = "CampusWebGIS";
            string p_strUser = "sa";
            string p_strPWD = "12345678";
            string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "LAPTOP-0RHISCBR", dbName, p_strUser, p_strPWD);

            // SQL查询语句
            string querySql = "SELECT * FROM Accidents";

            try
            {
                using (SqlConnection conn = new SqlConnection())
                {
                    conn.ConnectionString = ConnectionString;
                    conn.Open();

                    using (SqlCommand command = new SqlCommand(querySql, conn))
                    {
                    SqlDataReader reader = command.ExecuteReader();

                    // 创建一个对象列表来存储查询结果
                    List<object> results = new List<object>();

                    // 遍历读取查询结果
                    while (reader.Read())
                    {
                        // 将查询结果添加到对象列表中
                        results.Add(new
                        {
                            Time = reader["TIME"].ToString(),
                            X = reader["X"],
                            Y = reader["Y"],
                            Description = reader["Descript"]
                        });
                    }

                    // 将对象列表序列化为JSON字符串
                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    string json = serializer.Serialize(results);

                    // 将JSON字符串写入响应
                    context.Response.ContentType = "application/json";
                    context.Response.Write(json);
                    }
                }
            }
            catch (Exception ex)
            {
                context.Response.Write("Error: " + ex.Message);
            }
        }
        else if(action == "delete")
        {

        }
    }

    public bool IsReusable {
        get {
            return false;
        }
    }
}
