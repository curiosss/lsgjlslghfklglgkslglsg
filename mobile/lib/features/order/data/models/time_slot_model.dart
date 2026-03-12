class TimeSlot {
  final int id;
  final String startTime;
  final String endTime;

  String get label => '$startTime - $endTime';

  const TimeSlot({
    required this.id,
    required this.startTime,
    required this.endTime,
  });

  factory TimeSlot.fromJson(Map<String, dynamic> json) {
    return TimeSlot(
      id: json['id'] as int,
      startTime: json['start_time'] as String? ?? '',
      endTime: json['end_time'] as String? ?? '',
    );
  }
}
