<%@ WebHandler Language="C#" Class="RoadStatusHandler" %>

using System;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Collections.Generic;
using System.Web.Script.Serialization;

public class RoadStatusHandler : IHttpHandler 
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        string type = context.Request["type"];

        if(type=="single")
        {
            string fid = context.Request["fid"];
            if (string.IsNullOrEmpty(fid))
            {
                context.Response.Write("Error: Invalid FID");
                return;
            }

            // 连接字符串
            string dbName = "CampusWebGIS";
            string p_strUser = "sa";
            string p_strPWD = "12345678";
            string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "LAPTOP-0RHISCBR", dbName, p_strUser, p_strPWD);
            string querySql = "SELECT * FROM RoadStatus WHERE FID = @fid";

            // 创建一个对象列表来存储查询结果
            List<object> results = new List<object>();

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();

                    using (SqlCommand command = new SqlCommand(querySql, conn))
                    {
                        command.Parameters.AddWithValue("@fid", fid);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                results.Add(new
                                {
                                    Former5Hr = reader["Former5Hr"],
                                    Former4Hr = reader["Former4Hr"],
                                    Former3Hr = reader["Former3Hr"],
                                    Former2Hr = reader["Former2Hr"],
                                    Former1Hr = reader["Former1Hr"],
                                    RealTime = reader["RealTime"],
                                });
                            }
                        }
                    }
                }
                // 将对象列表序列化为JSON字符串
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string json = serializer.Serialize(results);

                // 将JSON字符串写入响应
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
            }
            catch (Exception ex)
            {
                context.Response.Write("Error: " + ex.Message);
                return;
            }
        }
        else if (type == "RealTime")
        {
            // 连接字符串
            string dbName = "CampusWebGIS";
            string p_strUser = "sa";
            string p_strPWD = "12345678";
            string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "LAPTOP-0RHISCBR", dbName, p_strUser, p_strPWD);
            string querySql = "SELECT FID, RealTime FROM RoadStatus";

            // 创建一个对象列表来存储查询结果
            List<object> results = new List<object>();

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();

                    using (SqlCommand command = new SqlCommand(querySql, conn))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            // 遍历读取查询结果，添加到列表中
                            while (reader.Read())
                            {
                                results.Add(new
                                {
                                    FID = reader["FID"],
                                    RealTime = reader["RealTime"],
                                });
                            }
                        }
                    }
                }
                // 将对象列表序列化为JSON字符串
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string json = serializer.Serialize(results);

                // 将JSON字符串写入响应
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
            }
            catch (Exception ex)
            {
                context.Response.Write("Error: " + ex.Message);
                return;
            }
        }
    }


    public bool IsReusable 
    {
        get {
            return false;
        }
    }

}