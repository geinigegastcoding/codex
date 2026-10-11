using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace VibeKeepAlive.Converters;

public sealed class CustomAgentVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture) =>
        value is string id && id.StartsWith("custom-", StringComparison.Ordinal)
            ? Visibility.Visible
            : Visibility.Collapsed;

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) =>
        throw new NotSupportedException();
}
