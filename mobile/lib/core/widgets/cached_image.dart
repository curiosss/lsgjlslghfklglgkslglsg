import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:commerce/core/constants/app_constants.dart';

class AppCachedImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  const AppCachedImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
  });

  String get _fullUrl {
    if (imageUrl.startsWith('http')) return imageUrl;
    return '${AppConstants.imageBaseUrl}$imageUrl';
  }

  @override
  Widget build(BuildContext context) {
    final image = CachedNetworkImage(
      imageUrl: _fullUrl,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => Container(
        width: width,
        height: height,
        color: Theme.of(context).colorScheme.surface,
      ),
      errorWidget: (context, url, error) => Container(
        width: width,
        height: height,
        color: Theme.of(context).colorScheme.surface,
        child: Icon(Icons.image_not_supported_outlined, color: Theme.of(context).colorScheme.secondary),
      ),
    );

    if (borderRadius != null) {
      return ClipRRect(borderRadius: borderRadius!, child: image);
    }
    return image;
  }
}
