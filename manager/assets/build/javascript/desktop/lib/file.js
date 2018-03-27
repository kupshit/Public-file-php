define(function(require) {
    return {
        parseSize: function(size) {
            if (size < 1024)
                return size + 'B';
            else if (size < 1048576)
                return Math.round(size / 1024, 2) + 'KB';
            else if (size < 1073741824)
                return Math.round(size / 1048576, 2) + 'MB';
            else
                return Math.round(size / 1073741824, 2) + 'GB';

            return size + 'B';
        }
    };
});