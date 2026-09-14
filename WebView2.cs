using System;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System.Web.Script.Serialization;

namespace Lattice
{
    public class MainForm : Form
    {
        private WebView2 webView;

        public MainForm()
        {
            this.WindowState = FormWindowState.Maximized;
            this.Text = "WebView2 Text";
            string iconPath = Application.StartupPath + "\\root\\static\\img\\app.ico";
            if (System.IO.File.Exists(iconPath))
            {
                this.Icon = new System.Drawing.Icon(iconPath);
            }
            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);
            this.Load += MainForm_Load;
        }

        private async void MainForm_Load(object sender, EventArgs e)
        {
            try
            {
                await webView.EnsureCoreWebView2Async();
                webView.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;
                webView.CoreWebView2.NavigationCompleted += CoreWebView2_NavigationCompleted;
                string rootPath = Path.Combine(Application.StartupPath, "root");
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping("lattice.test", rootPath, CoreWebView2HostResourceAccessKind.DenyCors);
                webView.CoreWebView2.Navigate("https://lattice.test/index.html");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString(), "WebView2 Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void CoreWebView2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (!e.IsSuccess)
            {
                return;
            }

            const string componentPath = "/components/popups/login-form.lattice";
            string componentName = BuildComponentName(componentPath);
            string script = "window.Lattice.define(" + ToJavaScriptString(componentName) + ", " + ToJavaScriptString(componentPath) + ");";
            this.ExecuteJavaScript(script);
        }

        private static string BuildComponentName(string componentPath)
        {
            string normalizedPath = componentPath.Replace('\\', '/').ToLowerInvariant();
            string fileName = Path.GetFileNameWithoutExtension(componentPath).ToLowerInvariant();

            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("Component path must include a file name.", "componentPath");
            }

            if (normalizedPath.Contains("/components/popups/"))
            {
                return fileName + "-popup";
            }

            if (normalizedPath.Contains("/components/pages/"))
            {
                return fileName + "-page";
            }

            return fileName;
        }

        private static string ToJavaScriptString(string value)
        {
            return new JavaScriptSerializer().Serialize(value);
        }

        private async void ExecuteJavaScript(string script)
        {
            try
            {
                string result = await webView.CoreWebView2.ExecuteScriptAsync(script);
                Console.WriteLine(result);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString(), "JavaScript Execution Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void CoreWebView2_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var data = serializer.Deserialize<object>(e.WebMessageAsJson);
            // how to use : data["key"]
            // string message = e.TryGetWebMessageAsString();
        }

        private async void SendValueToJavaScript(string value)
        {
            string json = "\"" + value.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"";
            await webView.CoreWebView2.ExecuteScriptAsync("receiveFromCSharp(" + json + ");");
        }

        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }
}
