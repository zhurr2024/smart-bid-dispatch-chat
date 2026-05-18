import React, { useState } from 'react'
import { Bid, Opportunity, ProductDetail } from '@/types'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Plus, Trash2, Info } from 'lucide-react'
import { useCreateOpportunity } from '@/hooks/useOpportunities'
import { useUpdateBidStatus } from '@/hooks/useBids'
import {
  BUSINESS_UNIT_OPTIONS,
  OPPORTUNITY_SOURCE_OPTIONS,
  OPPORTUNITY_STAGE_OPTIONS,
  PURCHASE_MODE_OPTIONS,
  PRODUCT_DOMAIN_OPTIONS,
  WIN_RATE_OPTIONS,
  SOLUTION_OPPORTUNITY_OPTIONS,
  MATERIAL_PRODUCT_GROUP_OPTIONS,
} from '@/constants/feedbackEnums'

interface CreateOpportunityFormProps {
  bid: Bid
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  businessUnit: string
  opportunitySource: string
  opportunityName: string
  customerName: string
  cdbId: string
  opportunityStage: string
  purchaseMode: string
  productDomain: string
  estimatedCloseDate: string
  winRate: string
  hasSolutionOpportunity: string
  notes: string
}

interface ProductDetailForm {
  materialProductGroup: string
  productLine: string
  estimatedRevenue: string
}

export const CreateOpportunityForm: React.FC<CreateOpportunityFormProps> = ({ bid, open, onClose, onSuccess }) => {
  const [form, setForm] = useState<FormData>({
    businessUnit: 'ISG',
    opportunitySource: 'BID_CONVERSION',
    opportunityName: bid.projectName,
    customerName: bid.purchaserName,
    cdbId: '',
    opportunityStage: 'DISCOVER_NEED',
    purchaseMode: 'NORMAL',
    productDomain: '',
    estimatedCloseDate: '',
    winRate: '',
    hasSolutionOpportunity: '',
    notes: '',
  })

  const [productDetails, setProductDetails] = useState<ProductDetailForm[]>([
    { materialProductGroup: '', productLine: '', estimatedRevenue: '' }
  ])

  const [errors, setErrors] = useState<string[]>([])
  const create = useCreateOpportunity()
  const updateStatus = useUpdateBidStatus()

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const setProductDetail = (index: number, field: keyof ProductDetailForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setProductDetails(details => {
        const updated = [...details]
        updated[index] = { ...updated[index], [field]: e.target.value }
        return updated
      })
    }

  const addProductDetail = () => {
    setProductDetails(d => [...d, { materialProductGroup: '', productLine: '', estimatedRevenue: '' }])
  }

  const removeProductDetail = (index: number) => {
    if (productDetails.length <= 1) return
    setProductDetails(d => d.filter((_, i) => i !== index))
  }

  const validate = (): string[] => {
    const errs: string[] = []
    if (!form.businessUnit) errs.push('请选择事业部')
    if (!form.opportunitySource) errs.push('请填写商机来源')
    if (!form.opportunityName.trim()) errs.push('商机名称不能为空')
    if (!form.customerName.trim()) errs.push('客户名称不能为空')
    if (!form.cdbId.trim()) errs.push('CDBID不能为空')
    if (!form.opportunityStage) errs.push('请选择商机阶段')
    if (!form.purchaseMode) errs.push('请选择采购模式')
    if (!form.productDomain) errs.push('请选择产品域')
    if (!form.estimatedCloseDate) errs.push('请选择预计签约日期')
    if (form.estimatedCloseDate && new Date(form.estimatedCloseDate) < new Date(new Date().toDateString())) {
      errs.push('预计签约日期不允许早于当前日期')
    }
    if (!form.winRate) errs.push('请选择赢率')
    if (!form.hasSolutionOpportunity) errs.push('请选择是否有解决方案机会')

    productDetails.forEach((pd, i) => {
      if (!pd.materialProductGroup) errs.push(`产品明细${i + 1}：请选择物料产品组`)
      if (!pd.estimatedRevenue) errs.push(`产品明细${i + 1}：请填写预计收入总金额`)
      if (pd.estimatedRevenue && (isNaN(Number(pd.estimatedRevenue)) || Number(pd.estimatedRevenue) < 0)) {
        errs.push(`产品明细${i + 1}：预计收入金额必须为非负数`)
      }
    })

    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])

    const details: ProductDetail[] = productDetails.map(pd => ({
      materialProductGroup: pd.materialProductGroup,
      productLine: pd.productLine || undefined,
      estimatedRevenue: Number(pd.estimatedRevenue),
    }))

    const payload = {
      bidId: bid.id,
      arUserId: bid.assignedTo ?? '',
      opportunityName: form.opportunityName,
      businessUnit: form.businessUnit,
      opportunitySource: form.opportunitySource,
      customerName: form.customerName,
      cdbId: form.cdbId,
      opportunityStage: form.opportunityStage,
      purchaseMode: form.purchaseMode,
      productDomain: form.productDomain,
      estimatedCloseDate: form.estimatedCloseDate,
      winRate: form.winRate,
      hasSolutionOpportunity: form.hasSolutionOpportunity,
      notes: form.notes || undefined,
      productDetails: details,
      stage: form.opportunityStage as any,
      estimatedAmount: details.reduce((sum, d) => sum + d.estimatedRevenue, 0),
    }

    await create.mutateAsync(payload as any)
    await updateStatus.mutateAsync({ id: bid.id, status: 'OPPORTUNITY' })
    onSuccess?.()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="创建新商机" width="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Subtitle */}
        <p className="text-xs text-[var(--text-3)]">已根据标讯信息自动预填</p>

        {/* Tip Banner */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-[6px] px-3 py-2.5">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">以下信息已从标讯自动提取，请确认或修改后提交</p>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <ul className="bg-red-50 border border-red-200 rounded-[6px] px-3 py-2 space-y-0.5">
            {errors.map(err => (
              <li key={err} className="text-xs text-red-600">• {err}</li>
            ))}
          </ul>
        )}

        {/* 基本信息 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-1)] mb-3">基本信息</h4>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="事业部 *"
              value={form.businessUnit}
              onChange={set('businessUnit')}
              options={BUSINESS_UNIT_OPTIONS}
            />
            <Select
              label="商机来源 *"
              value={form.opportunitySource}
              onChange={set('opportunitySource')}
              options={OPPORTUNITY_SOURCE_OPTIONS}
            />
            <Input
              label="商机名称 *"
              value={form.opportunityName}
              onChange={set('opportunityName')}
              required
            />
            <Input
              label="客户名称 *"
              value={form.customerName}
              onChange={set('customerName')}
              required
            />
            <Input
              label="CDBID *"
              value={form.cdbId}
              onChange={set('cdbId')}
              required
              placeholder="请输入CDBID"
            />
            <Select
              label="商机阶段 *"
              value={form.opportunityStage}
              onChange={set('opportunityStage')}
              options={OPPORTUNITY_STAGE_OPTIONS}
            />
            <Select
              label="采购模式 *"
              value={form.purchaseMode}
              onChange={set('purchaseMode')}
              options={PURCHASE_MODE_OPTIONS}
            />
          </div>
        </div>

        {/* 扩展信息 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-1)] mb-3">扩展信息</h4>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="产品域 *"
              value={form.productDomain}
              onChange={set('productDomain')}
              options={PRODUCT_DOMAIN_OPTIONS}
              placeholder="请选择产品域"
            />
            <Input
              label="预计签约日期 *"
              type="date"
              value={form.estimatedCloseDate}
              onChange={set('estimatedCloseDate')}
              required
            />
            <Select
              label="赢率 *"
              value={form.winRate}
              onChange={set('winRate')}
              options={WIN_RATE_OPTIONS}
              placeholder="请选择赢率"
            />
            <Select
              label="是否有解决方案机会 *"
              value={form.hasSolutionOpportunity}
              onChange={set('hasSolutionOpportunity')}
              options={SOLUTION_OPPORTUNITY_OPTIONS}
              placeholder="请选择"
            />
          </div>
          <div className="mt-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text-2)]">备注</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                className="border border-[var(--border-2)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] resize-none placeholder:text-[var(--text-3)]"
                placeholder="补充说明..."
              />
            </div>
          </div>
        </div>

        {/* 产品明细 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--text-1)]">产品明细</h4>
            <button
              type="button"
              onClick={addProductDetail}
              className="flex items-center gap-1 text-xs text-[var(--brand-6)] hover:text-[var(--brand-7)] cursor-pointer"
            >
              <Plus size={12} />
              添加产品明细
            </button>
          </div>

          <div className="space-y-3">
            {productDetails.map((pd, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end p-3 bg-[var(--fill-1)] rounded-[6px]">
                <Select
                  label={`物料产品组 *`}
                  value={pd.materialProductGroup}
                  onChange={setProductDetail(index, 'materialProductGroup')}
                  options={MATERIAL_PRODUCT_GROUP_OPTIONS}
                  placeholder="请选择"
                />
                <Input
                  label="产线"
                  value={pd.productLine}
                  onChange={setProductDetail(index, 'productLine')}
                  placeholder="选填"
                />
                <Input
                  label="预计收入总金额(万) *"
                  type="number"
                  min="0"
                  step="any"
                  value={pd.estimatedRevenue}
                  onChange={setProductDetail(index, 'estimatedRevenue')}
                  placeholder="0"
                />
                {productDetails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProductDetail(index)}
                    className="text-red-400 hover:text-red-600 cursor-pointer p-2"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 justify-end pt-2 border-t border-[var(--border-2)]">
          <Button variant="secondary" type="button" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" loading={create.isPending}>
            提交商机
          </Button>
        </div>
      </form>
    </Modal>
  )
}
