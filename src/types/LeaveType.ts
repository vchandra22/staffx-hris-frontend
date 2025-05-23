export interface ILeaveType {
    id: string;
    name: string;
    description: string;
    annual_allowance: number;
    requires_approval: number;
    minimum_notice_days: number;
    maximum_days_per_request: number;
    carried_forward: number;
    carry_forward_max_days: number;
    requires_attachment: number;
    half_day_allowed: number;
    created_at: string;
    updated_at: string;
}
